import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  private normalizePagination(skip: number, take: number, fallbackTake: number) {
    const safeSkip =
      Number.isFinite(Number(skip)) && Number(skip) > 0 ? Math.floor(Number(skip)) : 0;
    const safeTake =
      Number.isFinite(Number(take)) && Number(take) > 0
        ? Math.min(Math.floor(Number(take)), 500)
        : fallbackTake;

    return { safeSkip, safeTake };
  }

  async getAllTransactions(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    type?: string,
    category?: string,
    skip = 0,
    take = 20,
  ) {
    const { safeSkip, safeTake } = this.normalizePagination(skip, take, 20);
    const { data: userProperties } = await this.supabase
      .from('properties')
      .select('id')
      .eq('user_id', userId)
      .is('deleted_at', null);

    const propertyIds = (userProperties || []).map((p: any) => p.id);
    if (propertyIds.length === 0) return { data: [], count: 0, skip: safeSkip, take: safeTake };

    const buildQuery = () => {
      let query = this.supabase
        .from('transactions')
        .select('*, property:properties(id, name)', { count: 'exact' })
        .in('property_id', propertyIds)
        .is('deleted_at', null);

      if (startDate) {
        query = query.gte('transaction_date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        query = query.lte('transaction_date', endDate.toISOString().split('T')[0]);
      }
      if (type) query = query.eq('type', type);
      if (category) query = query.eq('category', category);

      return query.order('transaction_date', { ascending: false });
    };

    const { data, error, count } = await buildQuery().range(safeSkip, safeSkip + safeTake - 1);

    if (error) throw error;

    if ((count || 0) > 0 && (data || []).length === 0) {
      const fallback = await buildQuery().range(0, safeTake - 1);
      if (fallback.error) throw fallback.error;
      return {
        data: fallback.data || [],
        count: fallback.count ?? count,
        skip: 0,
        take: safeTake,
      };
    }

    return { data: data || [], count: count ?? 0, skip: safeSkip, take: safeTake };
  }

  async getGlobalSummary(userId: string, startDate?: Date, endDate?: Date) {
    const { data: userProperties } = await this.supabase
      .from('properties')
      .select('id')
      .eq('user_id', userId)
      .is('deleted_at', null);

    const propertyIds = (userProperties || []).map((p: any) => p.id);
    if (propertyIds.length === 0) {
      return {
        total_income: 0,
        total_expense: 0,
        net_profit: 0,
        by_category: {},
        by_month: {},
      };
    }

    let query = this.supabase
      .from('transactions')
      .select('type, category, amount, transaction_date')
      .in('property_id', propertyIds)
      .is('deleted_at', null);

    if (startDate) {
      query = query.gte('transaction_date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;

    const summary = {
      total_income: 0,
      total_expense: 0,
      net_profit: 0,
      by_category: {} as Record<string, number>,
      by_month: {} as Record<string, { income: number; expense: number }>,
    };

    (data || []).forEach((tx: any) => {
      if (tx.type === 'income') summary.total_income += Number(tx.amount);
      else summary.total_expense += Number(tx.amount);

      summary.by_category[tx.category] =
        (summary.by_category[tx.category] || 0) + Number(tx.amount);

      const month = (tx.transaction_date as string).slice(0, 7);
      if (!summary.by_month[month]) summary.by_month[month] = { income: 0, expense: 0 };
      if (tx.type === 'income') summary.by_month[month].income += Number(tx.amount);
      else summary.by_month[month].expense += Number(tx.amount);
    });

    summary.net_profit = summary.total_income - summary.total_expense;
    return summary;
  }

  async getTransactions(
    userId: string,
    propertyId: string,
    startDate?: Date,
    endDate?: Date,
    type?: string,
    category?: string,
    skip = 0,
    take = 20,
  ) {
    const { safeSkip, safeTake } = this.normalizePagination(skip, take, 20);
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const buildQuery = () => {
      let query = this.supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('property_id', propertyId)
        .is('deleted_at', null);

      if (startDate) {
        query = query.gte('transaction_date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        query = query.lte('transaction_date', endDate.toISOString().split('T')[0]);
      }
      if (type) {
        query = query.eq('type', type);
      }
      if (category) {
        query = query.eq('category', category);
      }

      return query.order('transaction_date', { ascending: false });
    };

    const { data, error, count } = await buildQuery().range(safeSkip, safeSkip + safeTake - 1);

    if (error) throw error;

    if ((count || 0) > 0 && (data || []).length === 0) {
      const fallback = await buildQuery().range(0, safeTake - 1);
      if (fallback.error) throw fallback.error;
      return {
        data: fallback.data || [],
        count: fallback.count ?? count,
        skip: 0,
        take: safeTake,
      };
    }

    return { data: data || [], count: count ?? 0, skip: safeSkip, take: safeTake };
  }

  async createTransaction(userId: string, propertyId: string, dto: CreateTransactionDto) {
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('transactions')
      .insert([{ property_id: propertyId, ...dto }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTransactionById(userId: string, transactionId: string) {
    const { data, error } = (await this.supabase
      .from('transactions')
      .select('*, property:properties(id, name, user_id)')
      .eq('id', transactionId)
      .single()) as any;

    if (error || !data) throw new NotFoundException('Transaction not found');
    if ((data.property as any)?.user_id !== userId) throw new ForbiddenException('Access denied');
    return data;
  }

  async updateTransaction(userId: string, transactionId: string, dto: UpdateTransactionDto) {
    const { data: tx } = (await this.supabase
      .from('transactions')
      .select('property:properties(user_id)')
      .eq('id', transactionId)
      .single()) as any;

    if (!tx || (tx.property as any)?.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('transactions')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTransaction(userId: string, transactionId: string) {
    const { data: tx } = (await this.supabase
      .from('transactions')
      .select('property:properties(user_id)')
      .eq('id', transactionId)
      .single()) as any;

    if (!tx || (tx.property as any)?.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { error } = await this.supabase
      .from('transactions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', transactionId);

    if (error) throw error;
  }

  async getSummary(userId: string, propertyId: string, startDate?: Date, endDate?: Date) {
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    let query = this.supabase
      .from('transactions')
      .select('type, category, amount')
      .eq('property_id', propertyId)
      .is('deleted_at', null);

    if (startDate) {
      query = query.gte('transaction_date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;

    const summary = {
      total_income: 0,
      total_expense: 0,
      by_category: {} as Record<string, number>,
    };

    (data || []).forEach((tx: any) => {
      if (tx.type === 'income') {
        summary.total_income += tx.amount;
      } else {
        summary.total_expense += tx.amount;
      }

      if (!summary.by_category[tx.category]) {
        summary.by_category[tx.category] = 0;
      }
      summary.by_category[tx.category] += tx.amount;
    });

    return summary;
  }
}

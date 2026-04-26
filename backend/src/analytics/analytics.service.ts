import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AnalyticsService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getDashboard(userId: string, startDate?: Date, endDate?: Date) {
    const { data: properties } = await this.supabase
      .from('properties')
      .select('id, name')
      .eq('user_id', userId)
      .is('deleted_at', null);

    const propertyIds = (properties || []).map((p) => p.id);

    if (propertyIds.length === 0) {
      return {
        summary: {
          total_properties: 0,
          total_units: 0,
          occupied_units: 0,
          vacant_units: 0,
          total_tenants: 0,
          active_contracts: 0,
          total_income: 0,
          total_expense: 0,
          net_profit: 0,
          occupancy_rate: 0,
        },
        by_month: [],
        by_category: { income: {}, expense: {} },
        recent_transactions: [],
        upcoming_reminders: [],
        expiring_contracts: [],
      };
    }

    const [
      { count: totalUnits },
      { data: userUnits },
      { data: activeContracts },
      { data: tenantsCount },
      { data: transactions },
      { data: recentTx },
      { data: upcomingReminders },
      { data: expiringContracts },
    ] = await Promise.all([
      this.supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .in('property_id', propertyIds)
        .is('deleted_at', null),
      this.supabase
        .from('units')
        .select('id')
        .in('property_id', propertyIds)
        .is('deleted_at', null),
      this.supabase
        .from('rental_contracts')
        .select('id, unit_id, end_date, rent_amount')
        .eq('status', 'active')
        .is('deleted_at', null),
      this.supabase
        .from('tenants')
        .select('id, unit:units!inner(property_id)')
        .in('unit.property_id', propertyIds)
        .is('deleted_at', null),
      (() => {
        let q = this.supabase
          .from('transactions')
          .select('type, category, amount, transaction_date')
          .in('property_id', propertyIds)
          .is('deleted_at', null);
        if (startDate) q = q.gte('transaction_date', startDate.toISOString().split('T')[0]);
        if (endDate) q = q.lte('transaction_date', endDate.toISOString().split('T')[0]);
        return q;
      })(),
      this.supabase
        .from('transactions')
        .select(`*, property:properties(id, name)`)
        .in('property_id', propertyIds)
        .is('deleted_at', null)
        .order('transaction_date', { ascending: false })
        .limit(8),
      this.supabase
        .from('reminders')
        .select(`*, property:properties(id, name)`)
        .in('property_id', propertyIds)
        .eq('status', 'pending')
        .is('deleted_at', null)
        .order('due_date', { ascending: true })
        .limit(8),
      this.supabase
        .from('rental_contracts')
        .select(`*, unit:units!inner(id, name, property:properties!inner(id, name, user_id))`)
        .eq('unit.property.user_id', userId)
        .eq('status', 'active')
        .is('deleted_at', null)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .lte(
          'end_date',
          new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        )
        .order('end_date', { ascending: true }),
    ]);

    const userUnitIds = new Set((userUnits || []).map((u) => u.id));
    const occupiedUnitSet = new Set(
      (activeContracts || [])
        .filter((c: any) => userUnitIds.has(c.unit_id))
        .map((c: any) => c.unit_id),
    );
    const occupiedUnits = occupiedUnitSet.size;
    const totalU = totalUnits || 0;

    let totalIncome = 0;
    let totalExpense = 0;
    const byMonthMap: Record<string, { month: string; income: number; expense: number }> = {};
    const byCategoryIncome: Record<string, number> = {};
    const byCategoryExpense: Record<string, number> = {};

    (transactions || []).forEach((tx: any) => {
      const amt = Number(tx.amount) || 0;
      const month = (tx.transaction_date as string).slice(0, 7);
      if (!byMonthMap[month]) byMonthMap[month] = { month, income: 0, expense: 0 };
      if (tx.type === 'income') {
        totalIncome += amt;
        byMonthMap[month].income += amt;
        byCategoryIncome[tx.category] = (byCategoryIncome[tx.category] || 0) + amt;
      } else {
        totalExpense += amt;
        byMonthMap[month].expense += amt;
        byCategoryExpense[tx.category] = (byCategoryExpense[tx.category] || 0) + amt;
      }
    });

    const byMonth = Object.values(byMonthMap).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    return {
      summary: {
        total_properties: propertyIds.length,
        total_units: totalU,
        occupied_units: occupiedUnits,
        vacant_units: Math.max(0, totalU - occupiedUnits),
        total_tenants: (tenantsCount || []).length,
        active_contracts: (activeContracts || []).filter((c: any) =>
          userUnitIds.has(c.unit_id),
        ).length,
        total_income: totalIncome,
        total_expense: totalExpense,
        net_profit: totalIncome - totalExpense,
        occupancy_rate: totalU > 0 ? Math.round((occupiedUnits / totalU) * 100) : 0,
      },
      by_month: byMonth,
      by_category: { income: byCategoryIncome, expense: byCategoryExpense },
      recent_transactions: recentTx || [],
      upcoming_reminders: upcomingReminders || [],
      expiring_contracts: expiringContracts || [],
    };
  }

  async getPropertyAnalytics(
    userId: string,
    propertyId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data: units } = await this.supabase
      .from('units')
      .select('id, name')
      .eq('property_id', propertyId)
      .is('deleted_at', null);

    let txQuery = this.supabase
      .from('transactions')
      .select('*')
      .eq('property_id', propertyId)
      .is('deleted_at', null);

    if (startDate) {
      txQuery = txQuery.gte('transaction_date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      txQuery = txQuery.lte('transaction_date', endDate.toISOString().split('T')[0]);
    }

    const { data: transactions } = await txQuery;

    let totalIncome = 0;
    let totalExpense = 0;
    const byCategory: Record<string, number> = {};
    const byUnit: Record<string, { income: number; expense: number }> = {};
    const byMonthMap: Record<string, { month: string; income: number; expense: number }> = {};

    (transactions || []).forEach((tx: any) => {
      const amount = Number(tx.amount) || 0;
      const month = (tx.transaction_date as string).slice(0, 7);
      if (!byMonthMap[month]) byMonthMap[month] = { month, income: 0, expense: 0 };

      if (tx.type === 'income') {
        totalIncome += amount;
        byMonthMap[month].income += amount;
      } else {
        totalExpense += amount;
        byMonthMap[month].expense += amount;
      }

      byCategory[tx.category] = (byCategory[tx.category] || 0) + amount;

      if (tx.unit_id) {
        if (!byUnit[tx.unit_id]) byUnit[tx.unit_id] = { income: 0, expense: 0 };
        if (tx.type === 'income') byUnit[tx.unit_id].income += amount;
        else byUnit[tx.unit_id].expense += amount;
      }
    });

    return {
      summary: {
        total_income: totalIncome,
        total_expense: totalExpense,
        net_profit: totalIncome - totalExpense,
      },
      by_category: byCategory,
      by_month: Object.values(byMonthMap).sort((a, b) => a.month.localeCompare(b.month)),
      by_unit: byUnit,
      units_breakdown: (units || []).map((u) => ({
        ...u,
        income: byUnit[u.id]?.income || 0,
        expense: byUnit[u.id]?.expense || 0,
      })),
    };
  }
}

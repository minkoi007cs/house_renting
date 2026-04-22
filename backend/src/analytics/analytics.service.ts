import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AnalyticsService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getDashboard(userId: string, startDate?: Date, endDate?: Date) {
    // Get all properties for user
    const { data: properties } = await this.supabase
      .from('properties')
      .select('id')
      .eq('user_id', userId)
      .is('deleted_at', null);

    const propertyIds = properties.map(p => p.id);

    // Get units count
    const { count: totalUnits } = await this.supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .in('property_id', propertyIds)
      .is('deleted_at', null);

    // Get occupied units
    const { count: occupiedUnits } = await this.supabase
      .from('rental_contracts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .is('deleted_at', null);

    // Get transactions summary
    let txQuery = this.supabase
      .from('transactions')
      .select('type, amount')
      .in('property_id', propertyIds)
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
    const byCategory = {};

    transactions.forEach(tx => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }
    });

    return {
      summary: {
        total_properties: propertyIds.length,
        occupied_units: occupiedUnits || 0,
        vacant_units: (totalUnits || 0) - (occupiedUnits || 0),
        total_income: totalIncome,
        total_expense: totalExpense,
        net_profit: totalIncome - totalExpense,
      },
    };
  }

  async getPropertyAnalytics(userId: string, propertyId: string, startDate?: Date, endDate?: Date) {
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Get units
    const { data: units } = await this.supabase
      .from('units')
      .select('id, name')
      .eq('property_id', propertyId)
      .is('deleted_at', null);

    // Get transactions
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
    const byCategory = {};
    const byUnit = {};

    transactions.forEach(tx => {
      const amount = tx.amount;
      if (tx.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      if (!byCategory[tx.category]) {
        byCategory[tx.category] = 0;
      }
      byCategory[tx.category] += amount;

      if (tx.unit_id) {
        if (!byUnit[tx.unit_id]) {
          byUnit[tx.unit_id] = { income: 0, expense: 0 };
        }
        if (tx.type === 'income') {
          byUnit[tx.unit_id].income += amount;
        } else {
          byUnit[tx.unit_id].expense += amount;
        }
      }
    });

    return {
      summary: {
        total_income: totalIncome,
        total_expense: totalExpense,
        net_profit: totalIncome - totalExpense,
      },
      by_category: byCategory,
      by_unit: byUnit,
      units_breakdown: units.map(u => ({
        ...u,
        ...byUnit[u.id],
      })),
    };
  }
}

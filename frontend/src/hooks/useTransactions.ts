import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types';
import api from '@/services/api';

interface Filters {
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
}

interface ListResponse {
  data: Transaction[];
  count: number;
  skip: number;
  take: number;
}

export const useTransactions = (filters: Filters = {}) => {
  const [data, setData] = useState<ListResponse>({ data: [], count: 0, skip: 0, take: 50 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, string | number> = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params[k] = v;
      });
      const res = await api.get('/transactions', { params });
      setData(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const updateTransaction = async (id: string, payload: Partial<Transaction>) => {
    const res = await api.patch(`/transactions/${id}`, payload);
    await fetchTransactions();
    return res.data.data;
  };

  const deleteTransaction = async (id: string) => {
    await api.delete(`/transactions/${id}`);
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions: data.data,
    total: data.count,
    isLoading,
    error,
    fetchTransactions,
    updateTransaction,
    deleteTransaction,
  };
};

export const useTransactionsSummary = (startDate?: string, endDate?: string) => {
  const [summary, setSummary] = useState<{
    total_income: number;
    total_expense: number;
    net_profit: number;
    by_category: Record<string, number>;
    by_month: Record<string, { income: number; expense: number }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await api.get('/transactions/summary', { params });
      setSummary(res.data.data);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, isLoading, refresh: fetch };
};

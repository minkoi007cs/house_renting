import { Transaction } from '@/types';

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const EMPTY_TRANSACTION_LIST: TransactionListResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
};

// Parses the new nested shape:
// { status, data: { data: Transaction[], total, page, limit, totalPages } }
export const parseTransactionListResponse = (
  payload: unknown,
): TransactionListResponse => {
  if (typeof payload !== 'object' || payload === null) return EMPTY_TRANSACTION_LIST;
  const outer = payload as Record<string, unknown>;
  const body = (typeof outer.data === 'object' && outer.data !== null)
    ? (outer.data as Record<string, unknown>)
    : outer;

  return {
    data: Array.isArray(body.data) ? (body.data as Transaction[]) : [],
    total: Number(body.total ?? 0),
    page: Number(body.page ?? 1),
    limit: Number(body.limit ?? 50),
    totalPages: Number(body.totalPages ?? 1),
  };
};

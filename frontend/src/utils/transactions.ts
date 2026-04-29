import { Transaction } from '@/types';

export interface TransactionListResponse {
  data: Transaction[];
  count: number;
  skip: number;
  take: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const normalizeTransactionListResponse = (
  payload: unknown,
  fallbackTake = 50,
): TransactionListResponse => {
  const body = isRecord(payload) && 'data' in payload ? payload.data : payload;

  if (Array.isArray(body)) {
    return { data: body, count: body.length, skip: 0, take: fallbackTake };
  }

  if (!isRecord(body)) {
    return { data: [], count: 0, skip: 0, take: fallbackTake };
  }

  const data = (
    Array.isArray(body.data) ? body.data : Array.isArray(body.items) ? body.items : []
  ) as Transaction[];
  const pagination = isRecord(body.pagination) ? body.pagination : {};

  return {
    data,
    count: toNumber(body.count ?? pagination.total, data.length),
    skip: toNumber(body.skip ?? pagination.skip, 0),
    take: toNumber(body.take ?? pagination.take, fallbackTake),
  };
};

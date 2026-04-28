import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatCurrency = (amount: number | string | undefined | null): string => {
  const n = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatNumber = (n: number | string | undefined | null): string => {
  const num = Number(n) || 0;
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return '—';
  return dayjs(date).format('MMM D, YYYY');
};

export const formatDateTime = (date: string | Date | undefined | null): string => {
  if (!date) return '—';
  return dayjs(date).format('MMM D, YYYY · h:mm A');
};

export const fromNow = (date: string | Date | undefined | null): string => {
  if (!date) return '—';
  return dayjs(date).fromNow();
};

export const toInputDate = (date: string | Date | undefined | null): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

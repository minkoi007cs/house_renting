import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// ── Currency config ───────────────────────────────────────────────────────────
// Add new entries here to support additional currencies; no other file changes needed.
type CurrencyMeta = { locale: string; fractionDigits: number; axisSymbol: string };

const CURRENCIES: Record<string, CurrencyMeta> = {
  USD: { locale: 'en-US',  fractionDigits: 0, axisSymbol: '$'  },
  VND: { locale: 'vi-VN',  fractionDigits: 0, axisSymbol: '₫'  },
  EUR: { locale: 'de-DE',  fractionDigits: 2, axisSymbol: '€'  },
  GBP: { locale: 'en-GB',  fractionDigits: 2, axisSymbol: '£'  },
  JPY: { locale: 'ja-JP',  fractionDigits: 0, axisSymbol: '¥'  },
  SGD: { locale: 'en-SG',  fractionDigits: 2, axisSymbol: 'S$' },
  THB: { locale: 'th-TH',  fractionDigits: 0, axisSymbol: '฿'  },
};

const getCode = () => localStorage.getItem('active_workspace_currency') || 'USD';
const getMeta = () => CURRENCIES[getCode()] ?? CURRENCIES.USD;

export const formatCurrency = (amount: number | string | undefined | null): string => {
  const n = Number(amount) || 0;
  const code = getCode();
  const { locale, fractionDigits } = getMeta();
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code in CURRENCIES ? code : 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
};

export const formatChartYAxis = (v: number): string => {
  const { axisSymbol } = getMeta();
  if (v >= 1e9) return `${axisSymbol}${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${axisSymbol}${(v / 1e6).toFixed(0)}M`;
  if (v >= 1e3) return `${axisSymbol}${(v / 1e3).toFixed(0)}K`;
  return `${axisSymbol}${v}`;
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

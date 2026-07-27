import dayjs from 'dayjs';

const escape = (v: string | number | null | undefined): string => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[,"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const downloadCSV = (
  basename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
): void => {
  const dated = `${basename}_${dayjs().format('YYYY-MM-DD')}`;
  const lines = [headers, ...rows].map((row) => row.map(escape).join(','));
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: `${dated}.csv` });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const printPage = (): void => {
  window.print();
};

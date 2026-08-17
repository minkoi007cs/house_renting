import { formatDate, formatCurrency } from './format';
import { TX_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from './labels';

export interface RentReceiptData {
  receiptNumber: string;
  date: string;
  propertyName: string;
  unitName?: string;
  landlordName: string;
  tenantName: string;
  amount: number;
  category: string;
  paymentMethod: string;
  notes?: string;
  status: 'paid' | 'pending' | 'partially_paid';
}

export const generateRentReceiptHTML = (data: RentReceiptData): string => {
  const categoryLabel = TX_CATEGORY_LABELS[data.category] || data.category;
  const methodLabel = PAYMENT_METHOD_LABELS[data.paymentMethod] || data.paymentMethod || 'Zelle / ACH';
  const statusColor = data.status === 'paid' ? '#10b981' : '#f59e0b';
  const statusText = data.status === 'paid' ? 'PAID IN FULL' : 'PENDING';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rent Receipt - ${data.receiptNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #7c3aed; display: flex; align-items: center; gap: 8px; }
    .title { font-size: 28px; font-weight: 700; color: #0f172a; text-align: right; }
    .status-badge { display: inline-block; padding: 6px 16px; background: ${statusColor}; color: white; font-weight: bold; border-radius: 20px; font-size: 14px; text-transform: uppercase; margin-top: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .card { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .card-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px; }
    .card-content { font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f1f5f9; text-align: left; padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1; }
    td { padding: 16px; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #334155; }
    .total-row { font-weight: bold; font-size: 18px; color: #0f172a; background: #f8fafc; }
    .footer { border-top: 2px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 13px; color: #64748b; margin-top: 40px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #7c3aed; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">🖨️ Print / Save as PDF</button>
  </div>

  <div class="header">
    <div class="logo">
      <span>🏠</span> Renthub Property Management
    </div>
    <div>
      <div class="title">RENT RECEIPT</div>
      <div style="font-size: 14px; color: #64748b; text-align: right;">Receipt #: ${data.receiptNumber}</div>
      <div style="text-align: right;"><span class="status-badge">${statusText}</span></div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Property Details</div>
      <div class="card-content">
        ${data.propertyName}<br/>
        ${data.unitName ? `Unit / Apt: ${data.unitName}<br/>` : ''}
        Date Issued: ${formatDate(data.date)}
      </div>
    </div>

    <div class="card">
      <div class="card-title">Payment Information</div>
      <div class="card-content">
        Tenant: ${data.tenantName || 'Tenant'}<br/>
        Payment Method: <strong>${methodLabel}</strong><br/>
        Landlord / Manager: ${data.landlordName || 'Property Manager'}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description / Item</th>
        <th>Category</th>
        <th>Payment Method</th>
        <th style="text-align: right;">Amount (USD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Rent / Payment for ${data.propertyName} ${data.unitName ? `(${data.unitName})` : ''}</td>
        <td>${categoryLabel}</td>
        <td>${methodLabel}</td>
        <td style="text-align: right; font-weight: 600;">${formatCurrency(data.amount)}</td>
      </tr>
      ${data.notes ? `
      <tr>
        <td colspan="4" style="font-size: 13px; color: #64748b; background: #f8fafc;">
          <strong>Memo / Notes:</strong> ${data.notes}
        </td>
      </tr>` : ''}
      <tr class="total-row">
        <td colspan="3" style="text-align: right; padding-right: 20px;">Total Received:</td>
        <td style="text-align: right; color: #7c3aed;">${formatCurrency(data.amount)}</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 30px; font-size: 14px; color: #475569; background: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #7c3aed;">
    Thank you for your prompt payment! Please retain this receipt for your personal tax and housing records.
  </div>

  <div class="footer">
    Generated automatically by Renthub Property Manager System • Official Payment Document
  </div>

  <script>
    // Auto-open print window if requested
    if (window.location.search.includes('print=true')) {
      window.onload = () => window.print();
    }
  </script>
</body>
</html>
  `;
};

export const printRentReceipt = (data: RentReceiptData): void => {
  const html = generateRentReceiptHTML(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};

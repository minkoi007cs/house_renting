export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: 'Single-Family Home',
  apartment: 'Apartment',
  condo: 'Condo',
  townhouse: 'Townhouse',
  duplex: 'Duplex',
  multi_family: 'Multi-Family (3–4 units)',
  mobile_home: 'Mobile / Manufactured Home',
  land: 'Land / Lot',
  other: 'Other',
};

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  sold: 'Sold',
};

export const UNIT_STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  unavailable: 'Unavailable',
};

export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  signed: 'Signed',
  active: 'Active',
  expired: 'Expired',
  terminated: 'Terminated',
  renewed: 'Renewed',
};

export const TX_CATEGORY_LABELS: Record<string, string> = {
  rent: 'Rent',
  service_fee: 'Late Fee',
  deposit_received: 'Security Deposit',
  deposit_refund: 'Deposit Refund',
  other_income: 'Other Income',
  repair: 'Repairs',
  maintenance: 'Maintenance',
  utilities: 'Utilities',
  brokerage: 'Leasing Commission',
  cleaning: 'Cleaning',
  tax: 'Property Tax',
  insurance: 'Insurance',
  other_expense: 'Other Expense',
};

export const REMINDER_TYPE_LABELS: Record<string, string> = {
  rent_payment_due: 'Rent payment due',
  contract_expiring: 'Contract expiring',
  maintenance_needed: 'Maintenance needed',
  custom_task: 'Custom task',
};

export const PAYMENT_CYCLE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  'bi-weekly': 'Bi-Weekly',
  quarterly: 'Quarterly',
  yearly: 'Annually',
};

export const statusBadgeClass = (status: string): string => {
  const map: Record<string, string> = {
    active: 'badge-green',
    available: 'badge-green',
    signed: 'badge-blue',
    occupied: 'badge-blue',
    pending: 'badge-amber',
    maintenance: 'badge-amber',
    draft: 'badge-gray',
    inactive: 'badge-gray',
    unavailable: 'badge-gray',
    sold: 'badge-gray',
    expired: 'badge-red',
    terminated: 'badge-red',
    done: 'badge-green',
    renewed: 'badge-blue',
  };
  return map[status] || 'badge-gray';
};

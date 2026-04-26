export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: 'House',
  apartment: 'Apartment',
  townhouse: 'Townhouse',
  land: 'Land',
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
  service_fee: 'Service fee',
  deposit_refund: 'Deposit refund',
  other_income: 'Other income',
  repair: 'Repair',
  maintenance: 'Maintenance',
  utilities: 'Utilities',
  brokerage: 'Brokerage',
  cleaning: 'Cleaning',
  other_expense: 'Other expense',
};

export const REMINDER_TYPE_LABELS: Record<string, string> = {
  rent_payment_due: 'Rent payment due',
  contract_expiring: 'Contract expiring',
  maintenance_needed: 'Maintenance needed',
  custom_task: 'Custom task',
};

export const PAYMENT_CYCLE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
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

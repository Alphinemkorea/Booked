const LABELS = {
  pending: 'Awaiting approval',
  approved: 'Ready to pay',
  paid: 'Paid',
  rejected: 'Rejected',
  active: 'Active loan',
  return_requested: 'Return requested',
  returned: 'Returned',
};
const TONES = {
  pending: 'chip-warning',
  approved: 'chip-info',
  paid: 'chip-success',
  rejected: 'chip-danger',
  active: 'chip-info',
  return_requested: 'chip-warning',
  returned: 'chip-success',
};

export function StatusChip({ status }) {
  const key = String(status || '').toLowerCase();
  return (
    <span className={`chip ${TONES[key] || ''}`}>
      {LABELS[key] || status}
    </span>
  );
}

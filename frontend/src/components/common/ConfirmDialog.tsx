import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface Props {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  loading?: boolean;
}

export const ConfirmDialog = ({
  title = 'Confirm action',
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  loading = false,
}: Props) => (
  <Modal title="" onClose={onCancel} size="sm">
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-1 text-sm text-ink-500">{message}</p>
      </div>
      <div className="flex gap-3 w-full mt-2">
        <button onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1">
          {loading ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);

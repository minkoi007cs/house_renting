import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal = ({ title, onClose, children, size = 'md' }: Props) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0b1222]/85 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-full ${sizeClass} bg-[#111a2e] border border-[#3d301d] rounded-2xl shadow-2xl max-h-[90vh] flex flex-col text-[#f4ede0]`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3d301d] flex-shrink-0">
            <h2 className="font-serif text-lg font-normal text-[#f4ede0]">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#f4ede0]/60 hover:text-[#c9a96e] hover:bg-[#0b1222] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

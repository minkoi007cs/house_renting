import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, ToastType } from '@/store/toastStore';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
  error: <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-[#c9a96e] flex-shrink-0" />,
};

const styles: Record<ToastType, string> = {
  success: 'bg-[#111a2e] border-emerald-800/80 text-[#f4ede0]',
  error: 'bg-[#111a2e] border-rose-800/80 text-[#f4ede0]',
  warning: 'bg-[#111a2e] border-amber-800/80 text-[#f4ede0]',
  info: 'bg-[#111a2e] border-[#c9a96e]/60 text-[#f4ede0]',
};

function ToastItem({ id, type, message }: { id: string; type: ToastType; message: string; duration?: number }) {
  const remove = useToastStore((s) => s.remove);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm w-full backdrop-blur-md
        transition-all duration-300 ease-out
        ${styles[type]}
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
    >
      {icons[type]}
      <p className="text-sm font-sans text-[#f4ede0] flex-1 leading-snug">{message}</p>
      <button
        onClick={() => remove(id)}
        className="text-[#f4ede0]/50 hover:text-[#c9a96e] transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} />
        </div>
      ))}
    </div>
  );
}

import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-ink-400" />
    </div>
    <p className="text-base font-semibold text-ink-700">{title}</p>
    {description && <p className="mt-1 text-sm text-ink-400">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

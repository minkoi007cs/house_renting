import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#111a2e] border border-[#3d301d] flex items-center justify-center mb-4 text-[#c9a96e]">
      <Icon className="w-8 h-8" />
    </div>
    <p className="font-serif text-lg font-normal text-[#f4ede0]">{title}</p>
    {description && <p className="mt-1 text-sm font-sans text-[#f4ede0]/60 font-light">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

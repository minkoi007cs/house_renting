import clsx from 'clsx';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ className, size = 'md' }: Props) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return (
    <div
      className={clsx(
        s,
        'animate-spin rounded-full border-2 border-ink-200 border-t-brand-600',
        className,
      )}
    />
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

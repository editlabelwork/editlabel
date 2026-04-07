import { LabelStatus, STATUS_CONFIG } from '@/types';

interface StatusBadgeProps {
  status: LabelStatus;
  size?: 'sm' | 'md';
}

const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgClass} ${config.textClass} ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;

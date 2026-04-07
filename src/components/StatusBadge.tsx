import { LabelStatus, STATUS_CONFIG } from '@/types';

interface StatusBadgeProps {
  status: LabelStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgClass} ${config.textClass}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

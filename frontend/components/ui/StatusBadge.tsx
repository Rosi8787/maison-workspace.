import { getStatusColor, getStatusLabel } from '@/lib/auth';

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

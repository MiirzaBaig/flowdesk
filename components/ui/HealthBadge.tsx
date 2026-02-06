import { clsx } from 'clsx';
import type { HealthSegment } from '@/types/customer';

interface HealthBadgeProps {
  segment: HealthSegment;
  showScore?: boolean;
  score?: number;
  size?: 'sm' | 'md';
}

const segmentConfig: Record<HealthSegment, { label: string; className: string }> = {
  healthy: {
    label: 'Healthy',
    className: 'bg-health-healthy text-white border-black',
  },
  watch: {
    label: 'Watch',
    className: 'bg-health-watch text-black border-black',
  },
  'at-risk': {
    label: 'At Risk',
    className: 'bg-health-at-risk text-white border-black',
  },
};

export function HealthBadge({ segment, showScore, score, size = 'md' }: HealthBadgeProps) {
  const config = segmentConfig[segment];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-bold border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span
        className={clsx(
          'border border-black',
          size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
          segment === 'healthy' && 'bg-white',
          segment === 'watch' && 'bg-black',
          segment === 'at-risk' && 'bg-white'
        )}
      />
      {config.label}
      {showScore && score !== undefined && (
        <span className="font-semibold">({score})</span>
      )}
    </span>
  );
}

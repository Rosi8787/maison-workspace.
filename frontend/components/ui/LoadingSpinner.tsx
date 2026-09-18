interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
};

export default function LoadingSpinner({
  size = 'md',
  color = '#c9a77a',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`${SIZES[size]} rounded-full animate-spin flex-shrink-0`}
      style={{
        borderColor: `${color}35`,
        borderTopColor: color,
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

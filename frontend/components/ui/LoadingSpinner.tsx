export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-16 h-16' };
  return (
    <div className={`${sizes[size]} border-4 border-primary-600 border-t-transparent rounded-full animate-spin`} />
  );
}

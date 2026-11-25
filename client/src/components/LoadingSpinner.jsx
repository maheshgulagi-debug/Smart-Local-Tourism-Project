export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-stone-200 border-t-brand-600" />
      <p className="text-sm font-medium text-stone-600">{label}</p>
    </div>
  );
}

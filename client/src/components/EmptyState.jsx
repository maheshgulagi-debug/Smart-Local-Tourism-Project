import { Compass } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing found',
  description = 'Try adjusting your filters or check back later.',
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <Compass className="mx-auto h-10 w-10 text-stone-400" />
      <h3 className="mt-3 text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 text-sm text-stone-600 max-w-md mx-auto">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

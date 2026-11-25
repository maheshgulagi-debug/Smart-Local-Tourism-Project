import { Star } from 'lucide-react';

export default function StarRating({
  rating = 0,
  interactive = false,
  onChange,
  size = 'sm',
}) {
  const iconClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  const rounded = Math.round(Number(rating || 0));

  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (interactive ? rating : rounded);
        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              className="p-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded"
            >
              <Star
                className={`${iconClass} ${
                  filled ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                }`}
              />
            </button>
          );
        }
        return (
          <Star
            key={star}
            className={`${iconClass} ${
              filled ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
            }`}
          />
        );
      })}
    </div>
  );
}

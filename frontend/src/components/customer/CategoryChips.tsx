'use client';

import { cn } from '@/lib/utils';

type CategoryItem = { id: string; name: string };

interface CategoryChipsProps {
  categories: CategoryItem[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryChips({ categories, activeId, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex overflow-x-auto pb-2 mb-4 -mx-4 px-4 md:mx-0 md:px-0 gap-2 hide-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 active:scale-95 shrink-0',
          activeId === null
            ? 'bg-primary text-on-primary shadow-sm'
            : 'border border-oat-milk text-on-surface-variant hover:bg-latte-beige'
        )}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 active:scale-95 shrink-0',
            activeId === cat.id
              ? 'bg-primary text-on-primary shadow-sm'
              : 'border border-oat-milk text-on-surface-variant hover:bg-latte-beige'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

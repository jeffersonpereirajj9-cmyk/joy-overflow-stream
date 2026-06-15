import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/books";

export function CategoryChip({ category }: { category: Category }) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug }}
      className={`relative h-20 w-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-3 shadow-lg shadow-black/30`}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative font-serif text-sm leading-tight text-white">{category.name}</div>
      <div className="relative mt-1 text-[10px] text-white/70">{category.description}</div>
    </Link>
  );
}
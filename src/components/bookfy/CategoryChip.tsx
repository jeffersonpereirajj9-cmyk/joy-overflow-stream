import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/books";

export function CategoryChip({ category }: { category: Category }) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug }}
      className={`relative h-20 w-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-3 shadow-lg shadow-black/30`}
    >
      {category.image && (
        <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="relative font-serif text-sm leading-tight text-white">{category.name}</div>
      <div className="relative mt-1 text-[10px] text-white/70">{category.description}</div>
    </Link>
  );
}
import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/books";

export function CategoryChip({ category }: { category: Category }) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug }}
      className={`group relative h-24 w-44 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-3.5 ring-1 ring-white/10 soft-shadow transition-all duration-300 hover:-translate-y-0.5 hover:ring-white/20`}
    >
      {category.image && (
        <img
          src={category.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="relative flex h-full flex-col justify-end">
        <div className="font-serif text-[15px] leading-tight tracking-tight text-white">{category.name}</div>
        <div className="mt-0.5 line-clamp-1 text-[10px] text-white/75">{category.description}</div>
      </div>
    </Link>
  );
}
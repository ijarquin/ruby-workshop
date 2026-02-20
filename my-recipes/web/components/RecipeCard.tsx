import Image from "next/image";

interface RecipeCardProps {
  title: string;
  imageURL: string;
  category: string;
}

export default function RecipeCard({
  title,
  imageURL,
  category,
}: RecipeCardProps) {
  return (
    <div
      className={
        "group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-stone-200"
      }
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageURL}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-amber-700/90 rounded-full tracking-wide uppercase">
          {category}
        </span>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
          <span className="text-white text-center font-serif italic font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            Click to show recipe preparation details
          </span>
        </div>
      </div>

      {/* Title section below image */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
}

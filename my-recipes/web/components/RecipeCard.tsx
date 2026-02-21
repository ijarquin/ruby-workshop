"use client";

import Image from "next/image";
import { useState } from "react";

function NoImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 100"
        className="w-28 h-28 mb-2"
        aria-hidden="true"
      >
        {/* Camera body */}
        <rect x="10" y="28" width="100" height="60" rx="8" fill="#d6d3d1" />
        {/* Lens ring */}
        <circle cx="60" cy="58" r="22" fill="#a8a29e" />
        <circle cx="60" cy="58" r="15" fill="#78716c" />
        {/* Viewfinder notch */}
        <rect x="44" y="20" width="32" height="12" rx="4" fill="#d6d3d1" />
        {/* Flash dot */}
        <circle cx="90" cy="38" r="5" fill="#a8a29e" />
        {/* Diagonal slash */}
        <line x1="18" y1="18" x2="102" y2="92" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <span className="text-xs font-medium text-stone-400 tracking-wide uppercase">
        No image available
      </span>
    </div>
  );
}

interface RecipeCardProps {
  title: string;
  imageURL: string;
  category: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function RecipeCard({
  title,
  imageURL,
  category,
  onClick,
  isSelected,
}: RecipeCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 ${isSelected ? "border-amber-700 ring-1 ring-amber-700" : "border-stone-200"}`}
    >
      <div className="relative h-56 overflow-hidden">
        {imgError ? (
          <NoImagePlaceholder />
        ) : (
          <Image
            src={imageURL}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
          />
        )}

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

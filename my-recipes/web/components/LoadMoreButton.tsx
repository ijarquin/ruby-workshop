interface LoadMoreButtonProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onLoadMore: () => void;
}

export default function LoadMoreButton({
  currentPage,
  totalPages,
  isLoading,
  onLoadMore,
}: LoadMoreButtonProps) {
  if (currentPage >= totalPages) return null;

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className={`px-6 py-3 rounded-md text-sm font-medium border transition-colors ${
          isLoading
            ? "border-stone-200 text-stone-400 bg-stone-100 cursor-not-allowed"
            : "border-amber-700 text-amber-700 bg-white hover:bg-amber-50 cursor-pointer"
        }`}
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}

export default function RecipeCardSkeletonLoading() {
  return (
    <div className="overflow-hidden rounded-md shadow-sm border border-stone-200 animate-pulse">
      <div className="h-56 bg-stone-200"></div>
      <div className="p-4 bg-white">
        <div className="h-5 w-3/4 bg-stone-200 rounded mb-2"></div>
        <div className="h-5 w-1/2 bg-stone-200 rounded"></div>
      </div>
    </div>
  );
}

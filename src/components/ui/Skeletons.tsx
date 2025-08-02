export const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-md animate-pulse">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-100 rounded-lg w-10 h-10"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const ClassroomCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-md animate-pulse">
    <div className="h-4 bg-gray-200 rounded mb-4"></div>
    <div className="h-6 bg-gray-300 rounded mb-2"></div>
    <div className="h-3 bg-gray-100 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

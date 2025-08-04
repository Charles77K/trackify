import Skeleton from "react-loading-skeleton";
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div className="flex flex-col gap-1 items-start mb-4">
      {/* Icon skeleton */}
      <Skeleton
        circle
        height={48}
        width={48}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />

      {/* Value skeleton */}
      <Skeleton
        height={32}
        width={120}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
        className="mb-5"
      />

      <div className="w-full">
        {/* Title skeleton */}
        <Skeleton
          height={10}
          width={160}
          baseColor="#f3f4f6"
          highlightColor="#e5e7eb"
          className="mb-2"
        />

        {/* Trend skeleton */}
        <div className="flex items-center gap-1">
          <Skeleton
            height={16}
            width={20}
            baseColor="#f3f4f6"
            highlightColor="#e5e7eb"
          />
          <Skeleton
            height={16}
            width={63}
            baseColor="#f3f4f6"
            highlightColor="#e5e7eb"
          />
        </div>
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

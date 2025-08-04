import React from "react";
import Skeleton from "react-loading-skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 5,
  showHeader = true,
}) => {
  return (
    <div className="w-full border border-gray-300 rounded-3xl p-2 mt-6 bg-white shadow-2xl">
      <table className="w-full">
        {showHeader && (
          <thead className="border-collapse">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="p-2 text-left font-medium">
                  <div className="flex items-center text-sm font-poppins py-1">
                    <Skeleton height={20} width={80} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 border-b border-gray-200 text-xs md:text-sm"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <Skeleton height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;

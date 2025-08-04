import React from "react";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { getRandomColor } from "../../lib/utils";

const StatCard = ({
  stat,
}: {
  stat: {
    icon: React.ReactNode;
    color: string;
    trend: string;
    change: string;
    value: string | number;
    title: string;
  };
}) => {
  const randomColor = getRandomColor();

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-start mb-4">
        <div
          className={`rounded-full p-3`}
          style={{ backgroundColor: randomColor }}
        >
          {stat.icon}
        </div>
        <p className="text-2xl font-bold text-sidebar mt-4">{stat.value}</p>

        <div className="mt-5">
          <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
          <div
            className={`gap-1 text-sm font-medium ${
              stat.trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {stat.trend === "up" ? (
              <MdTrendingUp size={16} />
            ) : (
              <MdTrendingDown size={16} />
            )}
            {stat.change}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

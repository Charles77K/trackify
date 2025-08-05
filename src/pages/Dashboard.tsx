import StatCard from "../components/admin/StatCard";
import RecentSales from "../components/admin/RecentSales";
import LowStock from "../components/admin/LowStock";
import { useFetch } from "../services/tanstack-helpers";
import {
  FaUsers,
  FaDollarSign,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";
import { StatCardSkeleton } from "../components/ui/Skeletons";
import type { DashboardStats } from "../lib/types";
import type { InventoryItem } from "./Inventory";
import { useMemo } from "react";

const Dashboard = () => {
  const { data: statData, isLoading: statsLoading } =
    useFetch<DashboardStats>("/dashboard/stats/");

  const { data: stock, isPending } = useFetch<{ results: InventoryItem[] }>(
    "/inventory/"
  );

  // Filter low stock items using the is_low_stock property or quantity < min_quantity
  const lowStock: InventoryItem[] = useMemo(() => {
    if (!stock?.results) return [];
    return stock.results.filter(
      (item) => item.is_low_stock || item.quantity <= item.min_quantity
    );
  }, [stock?.results]);

  const stats = [
    {
      icon: <FaUsers size={20} color="white" />,
      color: "blue",
      trend: "up",
      change: "+12%",
      value: statData?.total_inventory_items || "0",
      title: "Total inventory items",
    },
    {
      icon: <FaBoxOpen size={20} color="white" />,
      color: "yellow",
      trend: "up",
      change: "+5.3%",
      value: lowStock.length || "0",
      title: "Low Stock Items",
    },
    {
      icon: <FaDollarSign size={20} color="white" />,
      color: "green",
      trend: "down",
      change: "-8.5%",
      value: `$${statData?.today_sales || "0"}`,
      title: "Today's Sales",
    },
    {
      icon: <FaShoppingCart size={20} color="white" />,
      color: "red",
      trend: "down",
      change: "-3.2%",
      value: statData?.out_of_stock_items || "0",
      title: "Out of Stock",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 2xl:grid-cols-4">
        {statsLoading || isPending
          ? Array.from({ length: 4 }).map((_, idx) => (
              <StatCardSkeleton key={idx} />
            ))
          : stats.map((stat, idx) => <StatCard stat={stat} key={idx} />)}
      </div>

      <div className="mt-5">
        <RecentSales />
      </div>

      <div className="mt-5">
        <LowStock />
      </div>
    </div>
  );
};

export default Dashboard;

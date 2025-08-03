import { stats } from "../static";
import StatCard from "../components/admin/StatCard";
import RecentSales from "../components/admin/RecentSales";
import LowStock from "../components/admin/LowStock";

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 2xl:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard stat={stat} key={idx} />
        ))}
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

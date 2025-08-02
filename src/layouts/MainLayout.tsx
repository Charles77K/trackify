import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/features/Sidebar";
import Navbar from "../components/ui/features/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-5">
      <Sidebar />
      <main
        className={`
        flex-1 col-span-4 bg-gray-100
      `}
      >
        <Navbar />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

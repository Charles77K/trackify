import { useSelector } from "react-redux";
import { getUserProfile } from "../../store/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector(getUserProfile);

  const fullname = `${user?.first_name} ${user?.last_name}`;

  return (
    <div className="shadow-lg bg-white">
      <main className="flex-between p-6">
        <div>
          <h1 className="font-bold text-2xl text-sidebar">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Welcome to Green Plaza hotel management system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex-center rounded-full bg-sidebar">
            <p className="text-white font-bold">{fullname.charAt(0)}</p>
          </div>
          <div className="">
            <h3 className="text-sm font-bold text-black/80">{fullname}</h3>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Navbar;

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
            Welcome to Inferno&apos;s hotel management system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <img src="/vector.jpg" className="size-10 rounded-full" />
          <div className="">
            <h3 className="text-sm font-bold text-black/80">{fullname}</h3>
            <p className="text-xs text-gray-400">{user?.role} role</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Navbar;

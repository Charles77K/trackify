import React, { useState, useEffect } from "react";
import { MdDashboard, MdMenu, MdClose } from "react-icons/md";
import { ImBook } from "react-icons/im";
import { FaComments, FaGraduationCap, FaPowerOff } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import Toast from "../../../lib/Toast";
import type { ModalRef } from "../Modal";

const NAV_LINKS = [
  { path: "/", label: "Dashboard", icon: <MdDashboard /> },
  { path: "/admin/courses", label: "Inventory", icon: <ImBook /> },
  { path: "/admin/classrooms", label: "Sales", icon: <FaGraduationCap /> },
  { path: "/admin/lecturers", label: "Reports", icon: <FaUserTie /> },
  { path: "/admin/purchases", label: "Purchasing", icon: <FaComments /> },
  { path: "/admin/outlets", label: "Outlets", icon: <FaComments /> },
  { path: "/admin/users", label: "Users", icon: <FaComments /> },
  { path: "/admin/settings", label: "Settings", icon: <FaComments /> },
];

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = React.useRef<ModalRef>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Toast.success("Success", "You've successfully logged out");
    modalRef.current?.close();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <>
      <div className="flex items-center mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Inferno Hotel
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <MdClose size={24} className="text-white" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_LINKS.map((item, idx) => {
          const styledIcon = React.cloneElement(item.icon, {
            size: 20,
            className: "text-white",
          });

          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md font-poppins transition-all ${
                  isActive
                    ? "bg-sidebar-active text-white"
                    : "text-white hover:bg-sidebar-active"
                }`
              }
            >
              {styledIcon}
              {item.label}
            </NavLink>
          );
        })}

        <button
          onClick={() => modalRef.current?.open()}
          className="flex items-center gap-3 w-full px-4 py-3 text-white font-poppins hover:bg-sidebar-active rounded-md mt-1"
        >
          <FaPowerOff />
          Logout
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 border-b border-gray-200 p-4 z-40">
        <div className="flex flex-row-reverse items-center justify-between">
          <h1 className="text-xl font-bold text-black">TeachRank</h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MdMenu size={24} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-full min-h-screen bg-sidebar p-4">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`
          md:hidden fixed top-0 left-0 h-full w-64 bg-sidebar z-50 
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col p-4
        `}
      >
        <SidebarContent />
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        ref={modalRef}
        onPositive={handleLogout}
        title="Are you sure you want to logout?"
        positiveText="Yes"
        negativeText="No"
      />
    </>
  );
};

export default Sidebar;

import { useAuthStore } from "@src/store/useAuthStore";
import {
  BookOpen,
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { is } from "zod/v4/locales";

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigation("/login");
  };
  const navlinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 md:hidden transition-opacity duration-200 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none "
        }}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/60 z-50 md:relative md:w-64 md:shrink-0 md:flex md:flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <>
          {/* Logo and close button for mobile */}
          <div className="">
            <div className="">
              <div className="">
                <BrainCircuit className="" size={20} strokeWidth={2.5} />
              </div>
              <h1 className=""></h1>
            </div>
            <button onClick={toggleSidebar} className="">
              <X size={24} />
            </button>
          </div>
          {navlinks.map((link) => {
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={toggleSidebar}
                className={({
                  isActive,
                }) => `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-slate-50 hover:text-slate-900 hover:shadow-lg hover:shadow-emerald-500/30"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
              >
                {({ isActive }) => (
                  <>
                    <link.icon
                      size={18}
                      strokeWidth={2.5}
                      className={`transition-transform duration-200 ${
                        isActive ? "" : "group-hover:scale-110"
                      }`}
                    ></link.icon>
                    {link.text}
                  </>
                )}
              </NavLink>
            );
          })}
        </>

        <div className="">
          <button onClick={handleLogout} className="">
            <LogOut size={18} strokeWidth={2.5} className="" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

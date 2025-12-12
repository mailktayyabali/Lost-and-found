import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gradient-to-br from-[#2E5C6B] to-[#3D7A8C] text-white flex flex-col p-6">

      {/* USER PROFILE — TOP */}
      <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg mb-8">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
          JD
        </div>
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-sm opacity-80">User Account</p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-4 flex-1">

        <Link className="flex items-center gap-3 p-3 rounded-xl bg-white/10" to="#">
          <LayoutDashboard size={20} /> Dashboard Overview
        </Link>

        <Link className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl" to="#">
          <FileText size={20} /> My Reports
        </Link>

        <Link className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl" to="#">
          <User size={20} /> Edit Profile
        </Link>
      </nav>

      {/* LOGOUT BUTTON */}
     <button className="flex items-center gap-3 p-3 rounded-xl 
  bg-white/10 backdrop-blur-lg 
  hover:bg-white/20 
  text-white transition font-medium border border-white/20">
  <LogOut size={18} />
  Logout
</button>

    </aside>
  );
}

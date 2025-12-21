import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

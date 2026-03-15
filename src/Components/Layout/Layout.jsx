import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="pt-14 bg-gray-100 dark:bg-gray-950 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
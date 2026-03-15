import {
  Navbar as HeroNav, NavbarBrand, NavbarContent, NavbarItem,
  NavbarMenu, NavbarMenuItem,
  Dropdown, DropdownItem, DropdownTrigger, DropdownMenu,
} from "@heroui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Home, User, Bell, Settings, LogOut, Users, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setuserToken, setuserData, userData, toggleDarkMode, darkMode } = useContext(AuthContext);

  function handleLogout() {
    localStorage.removeItem("token");
    setuserToken(null);
    setuserData(null);
    navigate("/");
  }

  const navItems = [
    { name: "Feed", path: "/home", icon: <Home className="w-4 h-4" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-4 h-4" /> },
    { name: "Notifications", path: "/notifications", icon: <Bell className="w-4 h-4" /> },
    { name: "Suggestions", path: "/suggestions", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <HeroNav
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm fixed top-0 z-50"
      maxWidth="full" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}
    >
      {/* Brand */}
      <NavbarContent justify="start">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all mr-1">
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-xs">L</div>
            <span className="font-bold text-gray-900 dark:text-white sm:block">LinkUp</span>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Nav */}
      <NavbarContent className="hidden md:flex" justify="center">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
          {navItems.map((item) => (
            <NavbarItem key={item.name}>
              <NavLink to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`
                }>
                {item.icon}
                <span className="hidden lg:block">{item.name}</span>
              </NavLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* User Menu */}
      <NavbarContent justify="end">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
          {userData?.name}
        </span>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="flex items-center gap-1 outline-none">
              <img src={userData?.photo}
                onError={(e) => { e.target.src = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"; }}
                className="w-8 h-8 rounded-full object-cover cursor-pointer" alt="avatar" />
              <span className="text-gray-400 hidden sm:block">▾</span>
            </button>
          </DropdownTrigger>
          <DropdownMenu className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl min-w-[160px]">
            <DropdownItem key="profile" onClick={() => navigate("/profile")}
              startContent={<User className="w-4 h-4 text-gray-500" />}
              className="text-gray-700 dark:text-gray-200">Profile</DropdownItem>
            <DropdownItem key="settings" onClick={() => navigate("/change-password")}
              startContent={<Settings className="w-4 h-4 text-gray-500" />}
              className="text-gray-700 dark:text-gray-200">Settings</DropdownItem>
            <DropdownItem key="dark-mode" onClick={toggleDarkMode}
              startContent={darkMode ? <Sun className="w-4 h-4 text-gray-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
              className="text-gray-700 dark:text-gray-200">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </DropdownItem>
            <DropdownItem key="logout" onClick={handleLogout}
              startContent={<LogOut className="w-4 h-4 text-red-500" />}
              className="text-red-500">Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white dark:bg-gray-900 pt-4">
        {navItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <NavLink to={item.path} onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg text-base ${
                  isActive
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }>
              {item.icon} {item.name}
            </NavLink>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <button onClick={handleLogout}
            className="flex items-center gap-3 py-3 px-4 rounded-lg text-base text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroNav>
  );
}
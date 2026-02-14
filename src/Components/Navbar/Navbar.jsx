import {
  Navbar as HeroNav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";

import img from '../../../src/assets/link.jpg'
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { Home, User, MessageCircle , Video} from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let navigate = useNavigate();
  
  function LogOut() {
    localStorage.removeItem('token');
    setuserToken(null);
    setuserData(null);
    navigate('/');
  }

  const { userToken, setuserToken, userData, setuserData } = useContext(AuthContext);

  const menuItems = [
    { name: "Home", path: "/home", icon: <Home className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
    { name: "Chat", path: "#", icon: <MessageCircle className="w-5 h-5" /> },
    { name: "Reels", path: "#", icon: <Video className="w-5 h-5" /> },
  ];

  return (
    <HeroNav 
      className="bg-[#1a1f2e] border-b border-gray-800 shadow-xl fixed top-0 left-0 right-0 z-50" 
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-gray-400 hover:text-white"
        />
      </NavbarContent>

      {/* Logo - Mobile */}
      <NavbarContent className="md:hidden pr-3" justify="center">
        <NavbarBrand>
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 text-white font-bold text-lg shadow-lg">
              L
            </span>
            <span className="text-white">LinkUp</span>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Logo - Desktop */}
      <NavbarContent className="hidden md:flex gap-4" justify="start">
        <NavbarBrand>
          <div className="flex items-center gap-3 text-4xl font-semibold">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 text-white font-bold shadow-xl">
              L
            </span>
            <span className="text-white">LinkUp</span>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Navigation Links - Desktop */}
      <NavbarContent className="hidden md:flex gap-8" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <NavLink
              className={({isActive}) => `flex flex-col items-center justify-center text-center gap-1 transition-all duration-300 ${
                isActive 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white'
              }`}
              to={item.path}
            >
              {item.icon}
              <span className="text-xs font-medium uppercase tracking-wide">{item.name}</span>
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* User Avatar */}
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end" className="p-0">
          <DropdownTrigger >
            <Avatar
              isBordered
              as="button"
              className="transition-transform hover:scale-110"
              color="secondary"
              size="sm"
              src={userData?.photo}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Auth Actions" variant="flat" className="bg-[#1a1f2e] border border-gray-800 p-0">
            <DropdownItem 
              key="login" 
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Login
            </DropdownItem>
            <DropdownItem 
              key="register" 
              onClick={() => navigate('/register')}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Register
            </DropdownItem>
            <DropdownItem 
              onClick={LogOut} 
              key="logout" 
              color="danger"
              className="text-red-400"
            >
              Log Out : {userData?.name}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-[#1a1f2e] border-r border-gray-800 pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <NavLink
              className={({isActive}) => `w-full flex items-center gap-3 py-3 px-4 text-lg rounded-lg transition-all duration-300 ${
                isActive 
                ? 'text-white bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-l-4 border-purple-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroNav>
  );
}
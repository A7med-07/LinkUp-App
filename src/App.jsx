import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import { HeroUIProvider } from "@heroui/react";
import ProtectRoutes from "./Components/ProtectRoutes";
import Layout from "./Components/Layout/Layout";
import Login from "./auth/Login/Login";
import Register from "./auth/Register/Register";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import SinglePost from "./Pages/SinglePost";
import Notifications from "./Pages/Notifications";
import ChangePassword from "./Pages/ChangePassword";
import NotFound from "./Pages/NotFound";
import Suggestions from "./Pages/Suggestions";

const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Protected routes
  {
    element: <ProtectRoutes><Layout /></ProtectRoutes>,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/singlepost/:id", element: <SinglePost /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: '/suggestions', element: <Suggestions /> }
    ],
  },

  // 404
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return (
    <HeroUIProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </HeroUIProvider>
  );
}

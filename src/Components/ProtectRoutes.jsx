import { Navigate } from "react-router-dom";

export default function ProtectRoutes({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" />;
}

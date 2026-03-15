import { createContext, useEffect, useState } from "react";
import { getLoggedUser } from "../services/api";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [userToken, setuserToken] = useState(null);
  const [userData, setuserData] = useState(null);

  async function getUser() {
    const response = await getLoggedUser();
    if (response?.data?.user) {
      setuserData(response.data.user);
    }
  }

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setuserToken(t);
      getUser();
    }
  }, []);




  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

function toggleDarkMode() {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem("theme", newMode ? "dark" : "light");
  document.documentElement.classList.toggle("dark", newMode);
}

useEffect(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);

  return (
    <AuthContext.Provider value={{ userToken, setuserToken, userData, setuserData , darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}

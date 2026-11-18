import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "./MainLayout.css";

function MainLayout() {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("smartstock-theme") === "dark";
  });

  const toggleTheme = () => {
    setDarkMode((previous) => {
      const updated = !previous;

      localStorage.setItem(
        "smartstock-theme",
        updated ? "dark" : "light"
      );

      return updated;
    });
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-mode" : "light-mode"}`}>

      <Sidebar />

      <main className="main-content">

        <Topbar
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />

        <div className="page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default MainLayout;
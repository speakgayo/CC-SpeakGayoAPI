import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Flowbite, DarkThemeToggle } from "flowbite-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tourism from "./pages/Tourism";
import AddTourism from "./pages/AddTourism";
import EditTourism from "./pages/EditTourism";
import Account from "./pages/Account";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Flowbite theme={{ mode: theme }}>
      <Router>
        <div className="relative">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
          <div onClick={closeSidebar}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tourism" element={<Tourism />} />
              <Route path="/add_tourism" element={<AddTourism />} />
              <Route path="/edit_tourism/:id" element={<EditTourism />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </div>
          <div className="fixed bottom-4 right-4">
            <DarkThemeToggle
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            />
          </div>
        </div>
      </Router>
    </Flowbite>
  );
}

export default App;

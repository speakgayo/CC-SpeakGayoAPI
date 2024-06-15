import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Flowbite } from "flowbite-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Tourism from "./pages/Tourism";
import AddTourism from "./pages/AddTourism";
import EditTourism from "./pages/EditTourism";
import Account from "./pages/Account";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound"; // Import your 404 page component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
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

  const setAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  };

  return (
    <Flowbite theme={{ mode: theme }}>
      <Router>
        <div className="relative">
          {isAuthenticated && (
            <>
              <Header
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                theme={theme}
                setTheme={setTheme}
              />
              <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            </>
          )}
          <div onClick={closeSidebar} className={isAuthenticated ? "p-0" : ""}>
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Login setAuth={setAuth} />
                  )
                }
              />
              <Route
                path="/"
                element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/tourism"
                element={
                  isAuthenticated ? <Tourism /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/add_tourism"
                element={
                  isAuthenticated ? <AddTourism /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/edit_tourism/:id"
                element={
                  isAuthenticated ? <EditTourism /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/account"
                element={
                  isAuthenticated ? <Account /> : <Navigate to="/login" />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Flowbite>
  );
}

export default App;

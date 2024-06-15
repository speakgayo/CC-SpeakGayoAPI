import { Link, useNavigate } from "react-router-dom";
import {
  HiHome,
  HiOutlineLocationMarker,
  HiOutlineLogout,
} from "react-icons/hi";

export default function Sidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      {/* Dark overlay */}
      {isOpen && (
        <div
          className="fixed z-10 inset-0 bg-black opacity-50"
          onClick={closeSidebar}
        ></div>
      )}
      <aside
        className={`fixed z-20 h-full left-0 pt-16 w-64 transition-width duration-75 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 relative flex-1 flex flex-col min-h-0 border-r  border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 pt-5">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={closeSidebar}
              >
                <HiHome className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tourism"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={closeSidebar}
              >
                <HiOutlineLocationMarker className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Tourism</span>
              </Link>
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={{ cursor: "pointer" }}
              >
                <HiOutlineLogout className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Sign out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiChartPie,
  HiOutlineLocationMarker,
  HiChevronDown,
} from "react-icons/hi";

export default function Sidebar({ isOpen, closeSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
                <HiChartPie className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <button
                onClick={toggleDropdown}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <HiOutlineLocationMarker className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                  Tourism
                </span>
                <HiChevronDown />
              </button>
              <ul
                className={`py-2 space-y-2 ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    to="/tourism"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={closeSidebar}
                  >
                    Tourism
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                to="/account"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={closeSidebar}
              >
                <HiChartPie className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Account</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

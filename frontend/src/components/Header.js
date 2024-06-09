import { useState, useEffect, useRef } from "react";
import { HiX, HiMenuAlt1 } from "react-icons/hi";
import gayoIcon from "../assets/images/icons/icon-speak-gayo.png";
import peopleProfile from "../assets/images/people/profile-01.png";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <div className="bg-white  dark:bg-gray-800 fixed z-30 w-full border-b border-gray-200 dark:border-gray-700 px-3 py-3 lg:px-5 lg:pl-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start">
          <button
            onClick={toggleSidebar}
            className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-600 rounded"
          >
            {isSidebarOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenuAlt1 className="w-6 h-6" />
            )}
          </button>
          <a
            href="/"
            className="text-xl font-bold flex items-center lg:ml-2.5 text-gray-900 dark:text-white"
          >
            <img src={gayoIcon} alt="Gayo icon" width="47" />
            <span className="ml-2 self-center whitespace-nowrap">
              GayoTourism
            </span>
          </a>
        </div>
        <div
          className="relative flex items-center md:order-2 space-x-3 rtl:space-x-reverse"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            onClick={toggleUserDropdown}
          >
            <img
              className="w-8 h-8 rounded-full"
              src={peopleProfile}
              alt="user photo"
            />
          </button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-12 z-50 mt-2 w-48 text-base list-none bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Bonnie Green
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Earnings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

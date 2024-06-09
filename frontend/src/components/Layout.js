import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="p-5 sm:ml-64  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="pt-16">{children}</div>
    </div>
  );
};

export default Layout;

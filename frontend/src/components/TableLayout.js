import React from "react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";

const TableLayout = ({ children }) => {
  return (
    <div className="pt-16 sm:ml-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="pt-5 pl-5">
        <Breadcrumb aria-label="Default breadcrumb example" className="pb-4">
          <HiHome className="mr-2 text-xl" />
          <Link to="/">Home</Link>
          <Breadcrumb.Item href="#">Tourism</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-bold mb-4">Tourism</h1>
      </div>
      {children}
    </div>
  );
};

export default TableLayout;

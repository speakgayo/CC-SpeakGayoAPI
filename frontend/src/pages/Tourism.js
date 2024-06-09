import TableLayout from "../components/TableLayout";
import { Pagination } from "flowbite-react";
import { useState, useEffect } from "react";
import {
  HiOutlinePlusSm,
  HiPencilAlt,
  HiTrash,
  HiOutlineRefresh,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Tourism() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tourismData, setTourismData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onPageChange = (page) => setCurrentPage(page);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tourism");
      setTourismData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tourism data:", error);
      setErrorMessage("Not connected");
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();

    const storedSuccessMessage = localStorage.getItem("successMessage");
    const storedErrorMessage = localStorage.getItem("errorMessage");

    if (storedSuccessMessage) {
      setSuccessMessage(storedSuccessMessage);
      localStorage.removeItem("successMessage"); // Hapus pesan setelah ditampilkan
    }

    if (storedErrorMessage) {
      setErrorMessage(storedErrorMessage);
      localStorage.removeItem("errorMessage"); // Hapus pesan setelah ditampilkan
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/tourism/${id}`
      );
      // Jika penghapusan berhasil, perbarui data pariwisata
      if (response.data.success) {
        setTourismData(tourismData.filter((tourism) => tourism._id !== id));
        setSuccessMessage(response.data.success);
      }
    } catch (error) {
      console.error("Error deleting tourism data:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <TableLayout>
      <dir className="pr-5 pl-5">
        {errorMessage && (
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline pl-1">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline pl-1">{successMessage}</span>
          </div>
        )}
      </dir>
      <div className="block pr-5 pl-5 sm:flex items-center md:divide-x md:divide-gray-100 mb-4">
        <form className="sm:pr-3 mb-4 sm:mb-0" action="#" method="GET">
          <div className="mt-1 relative sm:w-64 xl:w-96">
            <input
              type="text"
              name="email"
              id="tourism-search"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 sm:text-sm rounded-lg focus:ring-cyan-600 dark:focus:ring-cyan-400 focus:border-cyan-600 dark:focus:border-cyan-400 block w-full p-2.5"
              placeholder="Search for tourism"
            />
          </div>
        </form>
        <div className="flex items-center sm:justify-end w-full">
          <div className="md:flex pl-2 space-x-1">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center"
            >
              <HiTrash size={34} />
            </a>
            <a
              onClick={refreshData}
              className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center"
            >
              <HiOutlineRefresh size={34} />
            </a>
          </div>
          <Link
            to="/add_tourism"
            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium inline-flex items-center rounded-lg text-sm px-3 py-2 text-center sm:ml-auto"
          >
            <HiOutlinePlusSm size={20} />
            Add tourism
          </Link>
        </div>
      </div>

      <div className="p-0">
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden">
                <table className="table-fixed min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all"
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-3 focus:ring-cyan-200 dark:focus:ring-cyan-600 h-4 w-4 rounded"
                          />
                          <label htmlFor="checkbox-all" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase"
                      >
                        Tourism Name
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase"
                      >
                        Address
                      </th>
                      <th scope="col" className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="p-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : errorMessage ? (
                      <tr>
                        <td colSpan="4" className="p-4 text-center">
                          Not connected
                        </td>
                      </tr>
                    ) : (
                      tourismData.map((tourism) => (
                        <tr
                          key={tourism._id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <td className="p-4 w-4">
                            <div className="flex items-center">
                              <input
                                id={`checkbox-${tourism._id}`}
                                aria-describedby="checkbox-1"
                                type="checkbox"
                                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-3 focus:ring-cyan-200 dark:focus:ring-cyan-600 h-4 w-4 rounded"
                              />
                              <label
                                htmlFor={`checkbox-${tourism._id}`}
                                className="sr-only"
                              >
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {tourism.name}
                            </div>
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {tourism.category}
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-gray-100">
                            {tourism.address}
                          </td>
                          <td className="p-4 whitespace-nowrap space-x-2">
                            <Link
                              to={`/edit_tourism/${tourism._id}`}
                              type="button"
                              className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-400 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2 text-center"
                            >
                              <HiPencilAlt size={20} />
                              Edit item
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(tourism._id)}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-600 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2 text-center"
                            >
                              <HiTrash size={20} />
                              Delete item
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 sticky sm:flex items-center w-full sm:justify-between bottom-0 right-0 border-t border-gray-200 p-4">
          <Pagination
            layout="table"
            currentPage={currentPage}
            totalPages={100}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      </div>
    </TableLayout>
  );
}

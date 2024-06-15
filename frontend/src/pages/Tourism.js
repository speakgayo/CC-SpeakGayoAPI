import TableLayout from "../components/TableLayout";
import { useState, useEffect } from "react";
import {
  HiOutlinePlusSm,
  HiPencilAlt,
  HiTrash,
  HiOutlineRefresh,
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Tourism() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [tourismData, setTourismData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showModalDeleteMultiple, setShowModalDeleteMultiple] = useState(false);

  // Fungsi untuk menampilkan ModalDelete konfirmasi
  const handleShowModalDelete = (id) => {
    setDeleteId(id);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setShowModalDelete(false);
    setDeleteId(null);
  };

  const handleShowModalDeleteMultiple = () => {
    setShowModalDeleteMultiple(true);
  };

  const handleCloseModalDeleteMultiple = () => {
    setShowModalDeleteMultiple(false);
  };

  const onPageChange = (page) => setCurrentPage(page);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tourism`);
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
      const response = await axios.delete(`${apiUrl}/tourism/${id}`);
      // Jika penghapusan berhasil, perbarui data pariwisata
      if (response.data.success) {
        setTourismData(tourismData.filter((tourism) => tourism._id !== id));
        setSuccessMessage(response.data.success);
      }
    } catch (error) {
      console.error("Error deleting tourism data:", error);
      setErrorMessage(error.message);
    }
    fetchData();
    handleCloseModalDelete();
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) => axios.delete(`${apiUrl}/tourism/${id}`))
      );
      setTourismData(
        tourismData.filter((tourism) => !selectedItems.includes(tourism._id))
      );
      setSuccessMessage("Selected items have been deleted successfully");
    } catch (error) {
      console.error("Error deleting selected items:", error);
      setErrorMessage(error.message);
    }
    setSelectedItems([]);
    fetchData();
    handleCloseModalDeleteMultiple();
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map((item) => item._id));
    }
  };

  // Calculate the number of pages
  const totalPages = Math.ceil(tourismData.length / itemsPerPage);

  // Filtered data based on search query
  const filteredData = tourismData.filter((tourism) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      tourism.name.toLowerCase().includes(lowerCaseQuery) ||
      tourism.address.toLowerCase().includes(lowerCaseQuery) ||
      tourism.category.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Get current items for the page
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <TableLayout>
      <div className="pr-5 pl-5">
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
      </div>
      <div className="block pr-5 pl-5 sm:flex items-center md:divide-x md:divide-gray-100 mb-4">
        <div className="flex mt-1 relative justify-between mb-2">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 sm:text-sm rounded-lg focus:ring-cyan-600 dark:focus:ring-cyan-400 focus:border-cyan-600 dark:focus:border-cyan-400 p-2.5 mr-4 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <input
            type="text"
            name="search"
            id="tourism-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 sm:text-sm rounded-lg focus:ring-cyan-600 dark:focus:ring-cyan-400 focus:border-cyan-600 dark:focus:border-cyan-400"
            placeholder="Search for tourism"
          />
        </div>

        <div className="md:pl-2 flex justify-between w-full">
          <div className="flex">
            <button
              onClick={handleShowModalDeleteMultiple}
              disabled={selectedItems.length === 0}
              className={`text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center ${
                selectedItems.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <HiTrash size={34} />
            </button>
            <a
              onClick={refreshData}
              className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center"
            >
              <HiOutlineRefresh size={34} />
            </a>
          </div>
          <Link
            to="/add_tourism"
            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium inline-flex items-center rounded-lg text-sm px-3 py-2 text-center"
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
                            className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-3 focus:ring-cyan-200 dark:focus:ring-cyan-600 h-4 w-4 rounded cursor-pointer"
                            checked={
                              selectedItems.length === currentData.length
                            }
                            onChange={handleSelectAll}
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
                    ) : currentData.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-4 text-center">
                          Data not found
                        </td>
                      </tr>
                    ) : (
                      currentData.map((tourism) => (
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
                                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-3 focus:ring-cyan-200 dark:focus:ring-cyan-600 h-4 w-4 rounded cursor-pointer"
                                checked={selectedItems.includes(tourism._id)}
                                onChange={() =>
                                  handleCheckboxChange(tourism._id)
                                }
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
                              {tourism.name.length > 30
                                ? `${tourism.name.substring(0, 27)}...`
                                : tourism.name}
                            </div>
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {tourism.category}
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-gray-100">
                            {tourism.address.length > 40
                              ? `${tourism.address.substring(0, 37)}...`
                              : tourism.address}
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
                              onClick={() => handleShowModalDelete(tourism._id)}
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
        <div className="md:flex md:justify-between bg-gray-100 dark:bg-gray-800 sticky items-center w-full bottom-0 right-0 border-t border-gray-200 p-4">
          <div className="flex sm: justify-end pr-2">
            <div className="text-sm text-gray-700 dark:text-gray-300 sm: justify-end">
              {`Showing `}
              <span className="font-bold">
                {currentPage > 1 ? (currentPage - 1) * itemsPerPage + 1 : 1}
              </span>
              {` to `}
              <span className="font-bold">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>
              {` of `}
              <span className="font-bold">{filteredData.length}</span>
              {` Entries`}
            </div>
          </div>

          <div className="flex pt-2 sm: justify-end">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              className="flex cursor-pointer items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              disabled={currentPage === 1}
            >
              <HiArrowNarrowLeft size={20} />
              Previous
            </button>
            <button
              onClick={goToNextPage}
              className="flex cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              disabled={currentPage === totalPages}
            >
              Next
              <HiArrowNarrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
      {showModalDelete && (
        <div
          id="popup-Modal"
          tabIndex="-1"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center bg-gray-500 bg-opacity-50"
          onClick={handleCloseModalDelete}
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
              <button
                onClick={handleCloseModalDelete}
                type="button"
                className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-Modal-hide="popup-Modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close Modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this data?
                </h3>
                <button
                  onClick={() => handleDelete(deleteId)}
                  data-Modal-hide="popup-Modal"
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={handleCloseModalDelete}
                  data-Modal-hide="popup-Modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModalDeleteMultiple && (
        <div
          id="popup-Modal"
          tabIndex="-1"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center bg-gray-500 bg-opacity-50"
          onClick={handleCloseModalDeleteMultiple}
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
              <button
                onClick={handleCloseModalDeleteMultiple}
                type="button"
                className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-Modal-hide="popup-Modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close Modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this data?
                </h3>
                <button
                  onClick={handleDeleteSelected}
                  data-Modal-hide="popup-Modal"
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={handleCloseModalDeleteMultiple}
                  data-Modal-hide="popup-Modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TableLayout>
  );
}

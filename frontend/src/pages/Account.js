import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Account() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showModalRegister, setShowModalRegister] = useState(false);

  const handleShowModalDelete = (id) => {
    setDeleteId(id);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setShowModalDelete(false);
    setDeleteId(null);
  };

  const handleShowModalRegister = () => {
    setShowModalRegister(true);
  };

  const handleCloseModalRegister = () => {
    setShowModalRegister(false);
  };

  useEffect(() => {
    // Fetch accounts on component mount
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/accounts`);
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleShowModalRegister(); // Show modal on form submission

    // The actual form submission logic will now be handled in the modal confirm action.
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/auth/accounts/${id}`);
      const response = await axios.get(`${apiUrl}/auth/accounts`);
      setAccounts(response.data);
      setSuccessMessage("Account deleted successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage("Failed to delete account");
      setSuccessMessage("");
    }
  };

  const handleRegisterConfirm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);

      await axios.post(`${apiUrl}/auth/register`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const response = await axios.get(`${apiUrl}/auth/accounts`);
      setAccounts(response.data);
      setForm({ name: "", username: "", email: "", password: "" });
      setSuccessMessage("Account registered successfully");
      setErrorMessage("");
      handleCloseModalRegister(); // Close modal after successful registration
    } catch (error) {
      console.error("Error registering account:", error);
      if (error.response) {
        console.error("Backend response:", error.response.data);
        setErrorMessage(
          error.response.data.error || "Failed to register account"
        );
      } else {
        setErrorMessage("Failed to register account");
      }
      setSuccessMessage("");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mb-3">Manage your account settings here.</p>

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

      <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-2">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Register New Admin Account</h2>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Type name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Type username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Type youremail@gmail.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Type password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-700"
            >
              Register
            </button>
          </form>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Admin Accounts</h2>
          <table className="min-w-full mt-4 border-collapse block md:table">
            <thead className="block md:table-header-group">
              <tr className="border border-gray-300 md:border-none block md:table-row absolute-top-full md:top-auto-left-full md:left-auto md:relative dark:border-gray-600 dark:bg-gray-700">
                <th className="bg-gray-200 dark:bg-gray-700 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell dark:text-gray-200">
                  Name
                </th>
                <th className="bg-gray-200 dark:bg-gray-700 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell dark:text-gray-200">
                  Username
                </th>
                <th className="bg-gray-200 dark:bg-gray-700 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell dark:text-gray-200">
                  Email
                </th>
                <th className="bg-gray-200 dark:bg-gray-700 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell dark:text-gray-                200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {accounts.map((account) => (
                <tr
                  key={account._id}
                  className="bg-white border border-gray-300 md:border-none block md:table-row dark:bg-gray-800 dark:border-gray-600"
                >
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell dark:text-gray-200">
                    {account.name}
                  </td>
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell dark:text-gray-200">
                    {account.username}
                  </td>
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell dark:text-gray-200">
                    {account.email}
                  </td>
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                    <button
                      onClick={() => handleShowModalDelete(account._id)}
                      className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {showModalRegister && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center bg-gray-500 bg-opacity-50"
          onClick={handleCloseModalRegister}
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
              <button
                onClick={handleCloseModalRegister}
                type="button"
                className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
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
                <span className="sr-only">Close modal</span>
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
                  Are you sure you want to save this data?
                </h3>
                <button
                  onClick={handleRegisterConfirm}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-cyan-600 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={handleCloseModalRegister}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-cyan-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

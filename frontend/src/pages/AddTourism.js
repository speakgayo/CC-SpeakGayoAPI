import React, { useState } from "react";
import Layout from "../components/Layout";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { FileInput, Label } from "flowbite-react";
import { HiCloudUpload, HiX } from "react-icons/hi";
import axios from "axios";

export default function AddTourism() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Fungsi untuk menampilkan modal konfirmasi
  const handleShowModal = (event) => {
    event.preventDefault(); // Jangan lupa untuk menghentikan perilaku bawaan dari tombol "Save"
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setFileName(file.name);
      setTimeout(() => {
        setImage(file);
        setImageUrl(URL.createObjectURL(file));
        setLoading(false);
      }, 2000); // Simulate a loading delay
      setFieldErrors((prevErrors) => ({ ...prevErrors, image: "" }));
    }
  };

  const handleCancel = () => {
    setImage(null);
    setImageUrl("");
    setFileName("");
  };

  const handleReset = () => {
    setName("");
    setCategory("");
    setAddress("");
    setDescription("");
    setImage(null);
    setImageUrl("");
    setFileName("");
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "image":
        setImage(value);
        break;
      default:
        break;
    }
    setFieldErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Validasi form
    const errors = {};
    if (!name) errors.name = "Name Tourism is required";
    if (!category) errors.category = "Category is required";
    if (!address) errors.address = "Address is required";
    if (!description) errors.description = "Description is required";
    if (!image) errors.image = "Image is required";
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post(`${apiUrl}/tourism`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setShowModal(false);
        localStorage.setItem("successMessage", response.data.success);
        setSuccessMessage(response.data.success);
        handleReset();
        navigate("/tourism");
      }
    } catch (error) {
      setShowModal(false);
      console.error("Error uploading tourism data:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to add tourism.");
      }
    } finally {
      setIsSubmitting(false); // Selesai proses pengiriman
    }
  };

  return (
    <Layout>
      <Breadcrumb aria-label="Default breadcrumb example" className="pb-4">
        <HiHome className="mr-2 text-xl" />
        <Link to="/">Home</Link>
        <Breadcrumb.Item>
          <Link to="/tourism">Tourism</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/add_tourism">Add Tourism</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-4">Add Tourism</h1>
      {errorMessage && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          role="alert"
        >
          <span className="sr-only">Error</span>
          <div>
            <span className="font-bold pl-1">Error!</span> {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
          role="alert"
        >
          <span className="sr-only">Success</span>
          <div>
            <span className="font-bold pl-1">Success!</span> {successMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleShowModal}>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="name"
              className={`block mb-2 text-sm font-medium ${
                fieldErrors.name
                  ? "text-red-700 dark:text-red-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              Name Tourism
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className={`bg-gray-50 border ${
                fieldErrors.name
                  ? "border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-400 focus:ring-red-500 dark:bg-gray-600 focus:border-red-500 block w-full p-2.5 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
              } text-sm rounded-lg`}
              placeholder="Type tourism name"
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {fieldErrors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, snapp!</span>{" "}
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="category"
              className={`block mb-2 text-sm font-medium ${
                fieldErrors.category
                  ? "text-red-700 dark:text-red-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              Category
            </label>
            <select
              id="category"
              className={`bg-gray-50 border ${
                fieldErrors.category
                  ? "border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-400 focus:ring-red-500 dark:bg-gray-600 focus:border-red-500 block w-full p-2.5 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
              } text-sm rounded-lg`}
              value={category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Natural Tourism">Natural Tourism</option>
              <option value="Food">Food</option>
              <option value="Place of Worship">Place of Worship</option>
            </select>
            {fieldErrors.category && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, snapp!</span>{" "}
                {fieldErrors.category}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label
              htmlFor="address"
              className={`block mb-2 text-sm font-medium ${
                fieldErrors.address
                  ? "text-red-700 dark:text-red-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className={`bg-gray-50 border ${
                fieldErrors.address
                  ? "border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-400 focus:ring-red-500 dark:bg-gray-600 focus:border-red-500 block w-full p-2.5 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
              } text-sm rounded-lg`}
              placeholder="Type address"
              value={address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            {fieldErrors.address && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, snapp!</span>{" "}
                {fieldErrors.address}
              </p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="description"
              className={`block mb-2 text-sm font-medium ${
                fieldErrors.description
                  ? "text-red-700 dark:text-red-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className={`bg-gray-50 border ${
                fieldErrors.description
                  ? "border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-400 focus:ring-red-500 dark:bg-gray-600 focus:border-red-500 block w-full p-2.5 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
              } text-sm rounded-lg`}
              placeholder="Type description"
              value={description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            ></textarea>
            {fieldErrors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, snapp!</span>{" "}
                {fieldErrors.description}
              </p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="image"
              className={`block mb-2 text-sm font-medium ${
                fieldErrors.image
                  ? "text-red-700 dark:text-red-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              Upload Image
            </label>
            <div className="flex w-full items-center justify-center">
              {!imageUrl && !loading ? (
                <Label
                  htmlFor="dropzone-file"
                  className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                    fieldErrors.image
                      ? "border-red-500 bg-gray-50 dark:border-red-500 dark:bg-gray-600"
                      : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                  } hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <HiCloudUpload
                      size={40}
                      className={`text-${
                        fieldErrors.image
                          ? "red-500 dark:text-red-400"
                          : "gray-500 dark:text-gray-400"
                      }`}
                    />
                    <p
                      className={`mb-2 text-sm ${
                        fieldErrors.image
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p
                      className={`text-xs ${
                        fieldErrors.image
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      PNG, JPG or GIF up to 5MB
                    </p>
                  </div>
                  <FileInput
                    id="dropzone-file"
                    className="hidden"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleImageUpload}
                  />
                </Label>
              ) : loading ? (
                <div className="flex h-64 w-full items-center justify-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-800"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                  <h3 className="pl-3">Loading...</h3>
                </div>
              ) : (
                <div className="relative w-full">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-64 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2"
                    onClick={handleCancel}
                  >
                    <HiX size={20} />
                  </button>
                  <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    {fileName}
                  </p>
                </div>
              )}
            </div>
            {fieldErrors.image && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, snapp!</span>{" "}
                {fieldErrors.image}
              </p>
            )}
          </div>
          <div className="col-span-2 flex justify-start space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg"
            >
              {isSubmitting ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
      {/* Tambahkan modal di sini */}
      {showModal && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center bg-gray-500 bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
              <button
                onClick={handleCloseModal}
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
                  onClick={handleSubmit}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-cyan-600 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={handleCloseModal}
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
      {/* Akhir modal */}
    </Layout>
  );
}

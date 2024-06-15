import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import { HiHome, HiArrowRight, HiArrowLeft } from "react-icons/hi";
import "../Home.css"; // Import the CSS file

export default function Home() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [tourismData, setTourismData] = useState([]);
  const [index, setIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null); // State to track selected place details
  const [showModal, setShowModal] = useState(false); // State to toggle modal visibility

  useEffect(() => {
    axios
      .get(`${apiUrl}/tourism`)
      .then((response) => {
        setTourismData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const showPrev = () => {
    if (index > 0) {
      setFadeClass("fade-out");
      setTimeout(() => {
        setIndex(index - 1);
        setFadeClass("fade-in");
      }, 250); // Duration of the CSS transition
    }
  };

  const showNext = () => {
    if (index < tourismData.length - 3) {
      setFadeClass("fade-out");
      setTimeout(() => {
        setIndex(index + 1);
        setFadeClass("fade-in");
      }, 250); // Duration of the CSS transition
    }
  };

  const handleMouseEnter = (placeId) => {
    setHoveredItem(placeId);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const openModal = (place) => {
    setSelectedPlace(place);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlace(null); // Reset selected place when closing modal
  };

  return (
    <Layout>
      <Breadcrumb aria-label="Default breadcrumb example" className="pb-4">
        <HiHome className="mr-2 text-xl" />
        <Link to="/">Home</Link>
      </Breadcrumb>
      <h1 className="text-2xl font-bold">Home</h1>

      <div className="relative mt-8">
        <div
          className={`flex flex-wrap md:flex-nowrap overflow-hidden ${fadeClass}`}
        >
          {tourismData.slice(index, index + 3).map((place) => (
            <article
              key={place._id}
              className="relative flex-shrink-0 w-full md:w-1/3 px-2 mb-4 md:mb-0"
              onMouseEnter={() => handleMouseEnter(place._id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40 max-w-sm mx-auto">
                <img
                  src={place.image}
                  alt={place.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 ${
                    hoveredItem === place._id ? "opacity-80" : "opacity-50"
                  }`}
                ></div>
                <strong className="z-10 mt-3 text-xl font-bold text-white">
                  {place.name.length > 25
                    ? `${place.name.substring(0, 22)}...`
                    : place.name}
                </strong>
                <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  {place.category}
                </div>
                {hoveredItem === place._id && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => openModal(place)}
                      className="absolute left-1/2 bottom-14 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-bold rounded-full text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      style={{ zIndex: "999" }} // Tambahkan properti z-index di sini
                    >
                      <p>Details</p>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          {index > 0 && (
            <button
              onClick={showPrev}
              className="bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 transition-colors"
            >
              <HiArrowLeft size={20} />
            </button>
          )}
          {index < tourismData.length - 3 && (
            <button
              onClick={showNext}
              className="bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 transition-colors"
            >
              <HiArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {selectedPlace && (
        <div>
          {/* Main modal */}
          <div
            onClick={closeModal}
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className={`modal ${
              showModal ? "show" : ""
            } fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center bg-gray-500 bg-opacity-50`}
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Detail Tourism
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={closeModal}
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
                </div>
                {/* Modal body */}
                <div className="p-4 md:p-5 space-y-4">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="text-base leading-relaxed">
                      <span className="text-2xl font-bold">
                        {selectedPlace.name}
                      </span>
                    </p>
                    <span className="text-sm leading-relaxed">
                      {selectedPlace.category}
                    </span>
                    <p className="mt-5">
                      {" "}
                      <span className="text-base font-bold">Address</span>
                    </p>
                    <p className="text-base leading-relaxed mb-5">
                      {selectedPlace.address}
                    </p>
                    <p className="mt-5">
                      {" "}
                      <span className="text-base font-bold">Description</span>
                    </p>
                    <p className="text-base leading-relaxed">
                      {selectedPlace.description}
                    </p>
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

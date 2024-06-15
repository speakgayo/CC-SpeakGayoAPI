import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import gayoIcon from "../assets/images/icons/icon-speak-gayo.png";

const Login = ({ setAuth }) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [inputError, setInputError] = useState({
    username: false,
    password: false,
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      setInputError({
        username: !username,
        password: !password,
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name); // Store name in localStorage
        localStorage.setItem("email", data.email); // Store email in localStorage
        setAuth(true);
        navigate("/");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img src={gayoIcon} alt="Gayo icon" width="47" />
          GayoTourism
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            {error && (
              <div
                className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-4 h-4 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className={`block mb-2 text-sm font-medium ${
                    inputError.username
                      ? "text-red-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  Your username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setInputError({ ...inputError, username: false });
                  }}
                  name="username"
                  id="username"
                  className={`bg-gray-50 border ${
                    inputError.username
                      ? "border-red-500 placeholder-red-700 dark:placeholder-red-400"
                      : "border-gray-300"
                  } text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="Type username"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className={`block mb-2 text-sm font-medium ${
                    inputError.password
                      ? "text-red-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setInputError({ ...inputError, password: false });
                  }}
                  name="password"
                  id="password"
                  placeholder="Type password"
                  className={`bg-gray-50 border ${
                    inputError.password
                      ? "border-red-500 placeholder-red-700 dark:placeholder-red-400"
                      : "border-gray-300"
                  } text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

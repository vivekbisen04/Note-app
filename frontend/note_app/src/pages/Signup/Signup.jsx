import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";


const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setshowpassword] = useState(false);
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  // Email validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    console.log(fname,password,email);
    
    // Validate inputs
    if (!validateEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    if (!fname) {
      setError("Please enter your first name.");
      return;
    }

    

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== conPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        email: email,
        fullName: fname,
        password: password,
      });

      console.log("Response:", response);

      if (response.data && response.data.error) {
        setError(response.data.error);
        return;
      }

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected Error Occurred. Please try again");
      }
    }

  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center mt-5">
        <form
          className="flex flex-col gap-4 max-w-sm bg-white p-5 rounded-2xl relative"
          onSubmit={handleSignup}
        >
          <p className="text-2xl text-royalblue font-semibold tracking-tight relative flex items-center pl-7">
            Register
            <span className="absolute left-0 w-4 h-4 bg-royalblue rounded-full"></span>
            <span className="absolute left-0 w-4 h-4 bg-royalblue rounded-full animate-pulse"></span>
          </p>
          <p className="text-gray-600 text-sm">
            Signup now and get full access to our app.
          </p>

          <div className="flex w-full gap-2">
            <label className="relative w-full">
              <input
                required
                type="text"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                placeholder="Full Name"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none"
              />
              <span className="absolute left-2 top-4 text-gray-400 text-sm cursor-text transition-all"></span>
            </label>
            {/* <label className="relative w-full">
              <input
                required
                type="text"
                value={lname}
                placeholder="Last Name"
                onChange={(e) => setLname(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none"
              />
            </label> */}
          </div>

          <label className="relative">
            <input
              required
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none"
            />
          </label>

          <label className="relative">
            <input
              required
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none"
            />
          </label>

          <label className="relative">
            <input
              required
              type="password"
              value={conPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none"
            />
          </label>

          {error && <p className="text-red-500 text-xs pt-2">{error}</p>}

          <button
            type="submit"
            className="border-none outline-none bg-royalblue p-2.5 rounded-md text-white text-lg transform duration-300 hover:bg-blue-600"
          >
            Submit
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-royalblue hover:underline">
              Signin
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;

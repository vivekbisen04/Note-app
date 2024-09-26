  import React, { useState } from "react";
  import Navbar from "../../components/Navbar/Navbar";
  import { useNavigate } from "react-router-dom";
  import { FaRegEye } from "react-icons/fa6";
  // import { validateEmail } from "../../utils/helper.js";

  import "./Login.css";
  import axiosInstance from "../../utils/axiosInstance";

  const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setshowpassword] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [Password, setPassword] = useState("");
    const togglePassword = () => {
      setshowpassword(!showPassword);
    };
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailRegex.test(email);
    }

    const handleLogin = async (e) => {
      e.preventDefault();
    
  setError("")

      if (!validateEmail(email)) {
        setError("Please enter a valid email address!");
        return;
      }
      

      if (!Password) {
        setError("Please Enter Password!");
        return;
      }

      if (Password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      setEmail("");

      try {
        const response = await axiosInstance.post("/auth/login", {
          email: email,
          password: Password,
        });
        console.log(response);
        
        console.log(response.data);
          
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        }
      } catch (error) {
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
          <div className="">
            <form className="form_container" onSubmit={handleLogin}>
              <div className="title_container">
                <p className="title">Login to your Account</p>
                <span className="subtitle">
                  Get started with our app, just create an account and enjoy the
                  experience.
                </span>
              </div>
              <br />
              <div className="input_container">
                <label className="input_label" htmlFor="email_field">
                  Email
                </label>
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                >
                  <path
                    strokeLinejoin="round"
                    sstrokelinecap="round"
                    strokeWidth="1.5"
                    stroke="#141B34"
                    d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    stroke="#141B34"
                    d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
                  ></path>
                </svg>
                <input
                  placeholder="name@mail.com"
                  title="Input title"
                  name="input-name"
                  type="text"
                  className="input_field"
                  id="email_field"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input_container">
                <label className="input_label" htmlFor="password_field">
                  Password
                </label>
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                >
                  <path
                    sstrokelinecap="round"
                    strokeWidth="1.5"
                    stroke="#141B34"
                    d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    sstrokelinecap="round"
                    strokeWidth="1.5"
                    stroke="#141B34"
                    d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"
                  ></path>
                </svg>

                <input
                  placeholder="Password"
                  title="Input title"
                  name="input-name"
                  type="password"
                  className="input_field"
                  id="password_field"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-xs pt-2">{error}</p>}
              <button title="Sign In" type="submit" className="sign-in_btn mt-4">
                <span>Sign In</span>
              </button>

              {/* <button title="Sign In" type="button" className="sign-in_ggl">
                <svg
                  height="18"
                  width="18"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                    <path fill="#fbbc05" d="M0 37V11l17 13z"></path>
                    <path fill="#ea4335" d="M0 11l17 13 7-6.1L48 14V0H0z"></path>
                    <path fill="#34a853" d="M0 37l30-23 7.9 1L48 0v48H0z"></path>
                    <path fill="#4285f4" d="M48 48L17 24l-4-3 35-10z"></path>
                  </g>
                </svg>
                <span>Sign In with Google</span>
              </button> */}
              {/* <button title="Sign In" type="button" className="sign-in_apl">
                <svg
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 315"
                  height="20px"
                  width="16px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      fill="#ffffff"
                      d="M213.803394,167.030943 C214.2452,214.609646 255.542482,230.442639 256,230.644727 C255.650812,231.761357 249.401383,253.208293 234.24263,275.361446 C221.138555,294.513969 207.538253,313.596333 186.113759,313.991545 C165.062051,314.379442 158.292752,301.507828 134.22469,301.507828 C110.163898,301.507828 102.642899,313.596301 82.7151126,314.379442 C62.0350407,315.16201 46.2873831,293.668525 33.0744079,274.586162 C6.07529317,235.552544 -14.5576169,164.286328 13.147166,116.18047 C26.9103111,92.2909053 51.5060917,77.1630356 78.2026125,76.7751096 C98.5099145,76.3877456 117.677594,90.4371851 130.091705,90.4371851 C142.497945,90.4371851 165.790755,73.5415029 190.277627,76.0228474 C200.528668,76.4495055 229.303509,80.1636878 247.780625,107.209389 C246.291825,108.132333 213.44635,127.253405 213.803394,167.030988 M174.239142,50.1987033 C185.218331,36.9088319 192.607958,18.4081019 190.591988,0 C174.766312,0.636050225 155.629514,10.5457909 144.278109,23.8283506 C134.171731,35.740383 125.401239,54.4466185 127.918298,72.5482694 C144.493508,73.6794347 163.254029,63.4885747 174.239142,50.1987033"
                    ></path>
                  </g>
                </svg>
                <span>Sign In with Apple</span>
              </button> */}
              <br />
              <div className="register_container">
                <p className="register">
                  Don't have an account?{" "}
                  <span>
                    <button
                      className="text-cyan-500"
                      type="button"
                      onClick={() => {
                        navigate("/signup");
                      }}
                    >
                      Create account
                    </button>
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  export default Login;

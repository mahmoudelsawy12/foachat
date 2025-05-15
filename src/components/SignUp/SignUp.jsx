import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import signupCSS from "./signup.module.css";
import "../../App.css";
import Header from "../Header/Header";
import { api } from "../../api/api";

function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dataForm, setDataForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (dataForm.password !== dataForm.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await api.signup({
        username: dataForm.username,
        email: dataForm.email,
        password: dataForm.password,
      });

      // Redirect to login page on success
      navigate("/login", {
        state: {
          message: "Sign up successful! Please log in with your credentials.",
        },
      });
    } catch (err) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="d-flex align-items-center justify-content-center  text-light ">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              {/* Left */}
              <div className="col-md-6 text-center text-md-start mb-4">
                <h1 className=" fw-bold">
                  We're Happy To
                  <br />
                  Have You Here!
                </h1>
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-outline-light rounded-3 mt-3"
                >
                  Skip the Signup?
                </button>
              </div>

              {/* Right - Signup Form */}
              <div className="col-md-6">
                <div className=" bg-secondary bg-opacity-25 p-4 shadow rounded-4">
                  <h2 className="h4 fw-semibold text-light mb-1 ">Sign up</h2>
                  <p className="text-light opacity-75 mb-4">
                    Just some details to get you in!
                  </p>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={dataForm.username}
                        onChange={handleChange}
                        className="form-control bg-transparent rounded-3"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={dataForm.email}
                        onChange={handleChange}
                        className="form-control bg-transparent rounded-3"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={dataForm.password}
                        onChange={handleChange}
                        className="form-control bg-transparent rounded-3"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={dataForm.confirmPassword}
                        onChange={handleChange}
                        className="form-control bg-transparent rounded-3"
                        required
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`rounded-3 w-100 ${signupCSS.signupButton} ${
                        loading ? "disabled" : ""
                      }`}
                    >
                      {loading ? "Signing up..." : "Sign up"}
                    </button>
                  </form>
                  <hr className="text-light" />
                  <p className="text-center text-light mt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      style={{ color: "var(--sign-color)" }}
                      className="btn btn-link text-decoration-none"
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;

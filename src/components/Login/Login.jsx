import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import loginCSS from "./login.module.css";
import Header from "../Header/Header";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }

    const state = location.state || {};
    if (state.message) {
      setSuccess(state.message);
      window.history.replaceState({}, document.title);
    }
    if (state.error) {
      setError(state.error);
      window.history.replaceState({}, document.title);
    }
  }, [location, navigate, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Store user data if remember me is checked
      if (dataForm.rememberMe) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      navigate("/chat");
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="d-flex align-items-center justify-content-center text-light p-2 mt-4">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              {/* Left */}
              <div className="col-md-6 text-md-start mb-4">
                <h1 className=" fw-bold">Welcome Back!</h1>
                <button
                  onClick={() => navigate("/home")}
                  className="btn btn-outline-light rounded-3 mt-3"
                >
                  Skip the login?
                </button>
              </div>
              {/* right - login form */}
              <div className="col-md-6">
                <div className=" bg-secondary bg-opacity-25 shadow rounded-4 p-4 ">
                  <h2 className="h4 fw-semibold text-light mb-1">Log in</h2>
                  <p className="text-light opacity-75 mb-4">
                    Glad you're back!
                  </p>

                  {error && <div className="alert alert-danger">{error}</div>}

                  {success && (
                    <div className="alert alert-success">{success}</div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control bg-transparent rounded-3 "
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control bg-transparent rounded-3"
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check p-0">
                        <input
                          type="checkbox"
                          className={`${loginCSS.formCheck} me-2 `}
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label text-light "
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        style={{ color: "var(--sign-color)" }}
                        className="btn btn-link text-decoration-none "
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`rounded-3 w-100 ${loginCSS.loginButton} ${
                        loading ? "disabled" : ""
                      }`}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                  <hr className="text-light" />
                  <p className="text-center text-light  mt-3">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      style={{ color: "var(--sign-color)" }}
                      className="btn custom-btn btn-link text-decoration-none"
                    >
                      Sign up
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

export default Login;

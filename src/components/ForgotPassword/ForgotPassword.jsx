import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotpassCSS from "./forgotpass.module.css";
import Header from "../Header/Header";
import { api } from "../../api/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.requestPasswordReset({ email });
      setSuccess("Reset code sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword({
        email,
        resetCode,
        newPassword,
      });

      setSuccess("Password reset successful!");

      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password has been reset successfully. Please login with your new password.",
          },
        });
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="d-flex align-items-center justify-content-center p-4 mt-3">
          <div className="row w-100 max-w-900 justify-content-center align-items-center">
            <div className="col-md-6 text-light text-md-start mb-2">
              <h1 className=" fw-bold"> No Worries</h1>
              <p>
                We'll help you reset your password,
                <br />
                Just follow these simple steps.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline-light rounded-3 mt-3 mb-3"
              >
                &larr; Take me back
              </button>
            </div>

            <div className="col-md-6">
              <div className="card bg-secondary bg-opacity-25 text-light shadow rounded-4 p-4">
                <h2 className="h4 fw-semibold text-light mb-1">
                  {step === 1 ? "Forgot Password?" : "Reset Password"}
                </h2>
                <p className="text-light opacity-75 mb-4">
                  {step === 1
                    ? "Enter your email to receive a reset code"
                    : "Enter the reset code and your new password"}
                </p>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                {step === 1 ? (
                  <form onSubmit={handleRequestReset}>
                    <div className="mb-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control  bg-transparent rounded-3"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${forgotpassCSS.resetButton} w-100 rounded-3`}
                    >
                      {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        className="form-control bg-transparent rounded-3"
                        placeholder="Reset Code"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control bg-transparent rounded-3"
                        placeholder="New Password"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control bg-transparent rounded-3"
                        placeholder="Confirm New Password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${forgotpassCSS.resetButton} w-100 rounded-3`}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                )}
                <hr />
                <p className="text-center mt-2">
                  Don't have an account?{" "}
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => navigate("/signup")}
                    style={{ color: "var(--sign-color)" }}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;

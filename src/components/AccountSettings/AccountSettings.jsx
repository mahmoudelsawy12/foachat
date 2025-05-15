import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import accountsettingsCSS from "./accountsettings.module.css";
import Header from "../Header/Header";
import { api } from "../../api/api";

function AccountSettings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", {
        state: { error: "Please login to access account settings" },
      });
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      setPasswordLoading(true);
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center text-white">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="d-flex align-items-center mb-4">
          <button
            onClick={() => navigate("/chat")}
            className={`${accountsettingsCSS.backButton} me-3`}
          >
            <i
              style={{ color: " var(--text-theme) " }}
              className="fas fa-arrow-left"
            ></i>
          </button>
          <h1 className="fw-bold fs-3 mb-0">Account Settings</h1>
        </div>

        <div className="card bg-secondary bg-opacity-25 text-white p-4 rounded-4">
          <h5 className="mb-3 ">
            <i className="fas fa-lock me-2 fs-6 "></i>Password
          </h5>
          {passwordError && (
            <div className="alert alert-danger">
              <i className="fas fa-times-circle me-2"></i>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle me-2"></i>
              {passwordSuccess}
            </div>
          )}
          <div className="d-flex flex-column flex-md-row gap-3 mb-3 mt-3">
            <div className="flex-grow-1 ">
              <label className="form-label ">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent text-light rounded-start-3 border-secondary">
                  <i className="fas fa-user text-secondary"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent text-light rounded-end-3 border-secondary"
                  value={user?.username}
                  disabled
                />
              </div>
            </div>
            <div className="flex-grow-1">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent text-light rounded-start-3 border-secondary">
                  <i className="fas fa-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-transparent text-light rounded-end-3 border-secondary"
                  value={user?.email}
                  disabled
                />
              </div>
            </div>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className="mb-3 ">
              <label className="form-label ">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-control bg-transparent rounded-3 border-secondary"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control bg-transparent rounded-3 border-secondary"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                required
                minLength={6}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control bg-transparent rounded-3 border-secondary"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className={`${accountsettingsCSS.changeButton}  px-4 py-2 rounded-3`}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AccountSettings;

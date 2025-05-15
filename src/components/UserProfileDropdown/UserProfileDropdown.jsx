import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const UserProfileDropdown = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Close dropdown when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const handleAccountSettings = () => {
    navigate("/account-settings");
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="btn rounded-circle d-flex align-items-center justify-content-center ms-5"
        style={{
          width: "35px",
          height: "35px",
          color: "var(--profile-text)",
          borderColor: "var(--profile-color)",
        }}
      >
        <i className="fas fa-user"></i>
      </button>

      {isOpen && (
        <div
          className="dropdown-menu show  border border-secondary border-opacity-25 shadow position-absolute end-0 mt-2"
          style={{ backgroundColor: "#1A1B2E" }}
        >
          <div className="dropdown-item text-secondary border-bottom border-secondary border-opacity-25">
            <p className="m-0 text-truncate">{username}</p>
          </div>

          <button
            onClick={handleAccountSettings}
            className="dropdown-item text-secondary d-flex align-items-center"
          >
            <i className="fas fa-cog me-2"></i>
            Account Settings
          </button>

          <button
            onClick={handleSignOut}
            className="dropdown-item text-secondary d-flex align-items-center"
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;

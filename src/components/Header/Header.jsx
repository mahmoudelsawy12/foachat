import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserProfileDropdown from "../UserProfileDropdown/UserProfileDropdown";
import { ThemeContext } from "../../contexts/ThemeContext";
import headerCSS from "./header.module.css";

function Header() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-transparent py-4">
        <div className="container-fluid">
          <NavLink
            to="/home"
            className={`${headerCSS.logo} navbar-brand fs-4 `}
          >
            <i class="fa-solid fa-robot"></i> FOA CHAT
          </NavLink>
          <button
            className="bg-transparent border border-2 border-white px-2 me-2 rounded-1 d-lg-none "
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars text-white"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul
              className={`${headerCSS.media} mx-auto mb-2 mb-lg-0 d-flex align-items-center justify-content-around w-100 list-unstyled flex-column flex-sm-row me-0`}
            >
              <div className="d-flex ms-5">
                <li className="nav-item ms-5 me-5">
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      isActive
                        ? `${headerCSS.activeLink} nav-link`
                        : `${headerCSS.navLink} nav-link`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                {isAuthenticated && (
                  <li className="nav-item me-5 ms-3">
                    <NavLink
                      to="/chat"
                      className={({ isActive }) =>
                        isActive
                          ? `${headerCSS.activeLink} nav-link`
                          : `${headerCSS.navLink} nav-link`
                      }
                    >
                      Chat AI
                    </NavLink>
                  </li>
                )}
                <li className="nav-item me-5 ms-3">
                  <NavLink
                    to="/team"
                    className={({ isActive }) =>
                      isActive
                        ? `${headerCSS.activeLink} nav-link`
                        : `${headerCSS.navLink} nav-link`
                    }
                  >
                    Our Team
                  </NavLink>
                </li>
                {/* <NavLink
                to="/home"
                className={`${headerCSS.logo} navbar-brand text-white fw-bolder fs-3 me-0 d-none d-lg-block`}
              >
                FOA CHAT AI
              </NavLink> */}
                <li className="nav-item ms-3">
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive
                        ? `${headerCSS.activeLink} nav-link`
                        : `${headerCSS.navLink} nav-link`
                    }
                  >
                    About Us
                  </NavLink>
                </li>
              </div>
              {isAuthenticated && user ? (
                <>
                  <UserProfileDropdown username={user.username} />
                  <li className="nav-item me-0">
                    <button
                      onClick={toggleTheme}
                      className="btn rounded-circle d-flex align-items-center justify-content-center ms-1"
                      style={{
                        width: "35px",
                        height: "35px",
                        color: "var(--toggle-text)",
                        borderColor: "var(--toggle-color)",
                      }}
                      title="Toggle Theme"
                    >
                      <i
                        className={`fa-solid ${
                          theme === "dark" ? "fa-sun" : "fa-moon"
                        }`}
                      ></i>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <div className="d-flex">
                    <li className={`${headerCSS.navItem1} me-5 ms-3 p-2`}>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          isActive
                            ? `${headerCSS.activeLink1}`
                            : `${headerCSS.navLink1} `
                        }
                      >
                        Log in
                      </NavLink>
                    </li>
                    <li className={`${headerCSS.navItem2} me-5 p-2`}>
                      <NavLink
                        to="/signup"
                        className={({ isActive }) =>
                          isActive
                            ? `${headerCSS.activeLink2}`
                            : `${headerCSS.navLink2}`
                        }
                      >
                        sign up
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <button
                        onClick={toggleTheme}
                        className="btn rounded-circle d-flex align-items-center justify-content-center ms-5 mt-1"
                        style={{
                          width: "35px",
                          height: "35px",
                          color: "var(--toggle-text)",
                          borderColor: "var(--toggle-color)",
                        }}
                        title="Toggle Theme"
                      >
                        <i
                          className={`fa-solid ${
                            theme === "dark" ? "fa-sun" : "fa-moon"
                          }`}
                        ></i>
                      </button>
                    </li>
                  </div>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;

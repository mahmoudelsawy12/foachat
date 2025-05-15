import React from "react";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import AccountSettings from "./components/AccountSettings/AccountSettings";
import OurTeam from "./components/OurTeam/OurTeam";
import AboutUs from "./components/AboutUs/AboutUs";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./components/NotFound/NotFound";

const routes = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "home", element: <Home /> },
  { path: "chat", element: <Chat /> },
  { path: "account-settings", element: <AccountSettings /> },
  { path: "team", element: <OurTeam /> },
  { path: "about", element: <AboutUs /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "*", element: <NotFound /> },
]);
function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <div className="app-container">
            {/* Background Overlay */}
            <div className="background-overlay"></div>
            <RouterProvider router={routes} />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

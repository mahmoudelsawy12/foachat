import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Chat from './pages/Chat';
import AccountSettings from './pages/AccountSettings';
import AboutUs from './pages/AboutUs';
import OurTeam from './pages/OurTeam';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/account-settings" element={<AccountSettings />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/our-team" element={<OurTeam />} />
    </Routes>
  );
}

export default App;
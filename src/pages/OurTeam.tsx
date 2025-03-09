import React from 'react';
import NavBar from '../components/NavBar';

function OurTeam() {
  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white">
      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            This is the Our Team page. You can add your team members here.
          </p>
        </div>

        {/* Content will be added later */}
        <div className="bg-[#1A1B2E]/50 backdrop-blur-lg rounded-2xl p-8">
          <p className="text-center text-gray-400">
            Team members coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default OurTeam;
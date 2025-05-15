import React from "react";
import Header from "../Header/Header";
import "./aboutus.css";
import logo from "/src/assets/images/Rectangle.svg";
import CircleAnimation from "/src/assets/images/CircleAnimation.png";

function AboutUs() {
  return (
    <>
      <Header />
      <section className="container py-5">
        <div className="glass-card bg-transparent text p-4 mt-4 border border-secondary border-1 rounded-4">
          <h2 className="fw-bold mb-2">
            <i
              className="fa-solid fa-quote-left fs-2 me-2"
              style={{ color: "var(--quote-color)" }}
            ></i>
            {/* <i class="fa-solid fa-users-line text-warning fs-2 me-2 ms-4"></i> */}
            About Us
          </h2>
          <p className="ms-4">Welcome to FOA Chat ,</p>
          <p className="ms-4 ">
            Whether this is your first step, your first day, or your first
            transition, we’re here to guide you every step of the way.
          </p>

          {/* Image and Text */}
          <div className="about-flex mt-3 mb-3 me-3">
            <div className="logo-container">
              <img src={logo} alt="University Logo" className="logo-img" />
            </div>
            <div className="text-container">
              <p className="lead fw-normal mb-0">
                <span
                  className="fs-3 me-2"
                  style={{ color: "var(--quote-color)" }}
                >
                  ❝
                </span>
                Foa Chat is a smart chatbot designed specifically to assist
                newcomers. You will get what you are looking for and all the
                information you need.
                <span
                  className="fs-3 ms-2"
                  style={{ color: "var(--quote-color)" }}
                >
                  ❞
                </span>
              </p>
            </div>
          </div>
        </div>
        <img src={CircleAnimation} alt="image" class="CircleAnimation"></img>
      </section>
    </>
  );
}
export default AboutUs;

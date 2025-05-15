import React, { useRef } from "react";
import Header from "../Header/Header";
import "./ourteam.css";
import CircleAnimation from "/src/assets/images/CircleAnimation.png";
import mohamed from "../../assets/images/mohamed.jpg";
import amira from "../../assets/images/amira.jpg";
import esraa from "../../assets/images/esraa.jpg";
import mahmoud from "../../assets/images/mahmoud.jpg";
import menna from "../../assets/images/menna.jpg";
import hala from "../../assets/images/hala.jpg";
import nouran from "../../assets/images/nouran.jpg";
import maha from "../../assets/images/maha.jpg";
import sara from "../../assets/images/sara.jpg";
import ahmed from "../../assets/images/ahmed.jpg";

function OurTeam() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const imagesData = [
    {
      url: mohamed,
      name: "Mohamed Ghoraba.",
      track: "UI/UX",
    },
    { url: amira, name: "Amira Magdy.", track: "Front End" },
    {
      url: esraa,
      name: "Esraa Mohamed.",
      track: "Front End",
    },
    {
      url: mahmoud,
      name: "Mohamed Elsawy.",
      track: "Back End /Tester",
    },
    {
      url: menna,
      name: "Menna Farag.",
      track: "Back End",
    },
    {
      url: hala,
      name: "Hala Mohamed.",
      track: "Back End",
    },
    { url: nouran, name: "Nouran Shreef.", track: "Researcher" },
    {
      url: maha,
      name: "Maha Elsaqqa.",
      track: "Digital Marketing",
    },
    {
      url: sara,
      name: "Sara khaled.",
      track: "Digital Marketing",
    },
    {
      url: ahmed,
      name: "Ahmed .",
      track: "flutter dev",
    },
  ];
  return (
    <>
      <Header />
      <div className="container">
        <section className="main text glass-card bg-transparent p-4 rounded-4 border border-1 border-secondary m-5">
          <div className="ms-4 mt-2 me-5">
            <h1 className="text-start fw-bold fs-2">Meet our team</h1>
            <p className="text-start my-2">
              Welcome to our team page! We are a passionate group of developers,
              designers, and innovators dedicated to building FOA Chat AI.
              Together, we combine our skills to create something impactful and
              user-friendly.
            </p>
          </div>
          <div className="d-flex gap-2 p-2">
            <button
              className="bg-transparent border-0 text-secondary"
              onClick={scrollLeft}
            >
              <i class="fa-solid fa-backward fs-5"></i>
            </button>
            <div
              className="d-flex w-100 p-3"
              ref={scrollRef}
              style={{
                overflowX: "auto",
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                backgroundColor: "transparent",
                margin: "10px auto",
              }}
            >
              {imagesData.map((person, index) => (
                <div key={index} className="image-container">
                  <img
                    className="rounded-circle me-3"
                    src={person.url}
                    alt={person.name}
                  />
                  <span className="hover-text">
                    {person.name} <br /> {person.track}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="bg-transparent border-0 text-secondary"
              onClick={scrollRight}
            >
              <i class="fa-solid fa-forward fs-5"></i>
            </button>
          </div>
        </section>
        <img src={CircleAnimation} alt="team" className="CircleAnimation" />
      </div>
    </>
  );
}
export default OurTeam;

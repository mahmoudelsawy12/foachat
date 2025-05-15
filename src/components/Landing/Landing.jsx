import React from "react";
import { useNavigate } from "react-router-dom";
import landingCSS from "./landing.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="d-flex flex-column justify-content-center align-items-center text-center py-5 ">
          <h2 className={landingCSS.h2}>FOA CHAT AI</h2>

          <p className={`w-75 lh-base ${landingCSS.desc}`}>
            "Hi there! 🎓 I'm your college chatbot, here to guide you and make
            your student life easier — whether you're looking for university
            resources, department information, or just have questions about
            college or need help navigating services. <br /> I'm here 24/7 to
            assist you. How can I help you?"
          </p>
          <div style={{ width: "200px", height: "200px" }}>
            <DotLottieReact
              src="https://lottie.host/9fededb8-caa1-4f19-bfa9-4fe81ade13a5/QWuE4FweuL.lottie"
              loop
              autoplay
            />
          </div>
          <button
            onClick={() => navigate("/chat")}
            className={` ${landingCSS.homeButton}`}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
export default Landing;

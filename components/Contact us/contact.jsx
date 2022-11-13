import React from "react";
import styles from "../../styles/contact.module.css";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../Footer"));

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_lk8dzj9",
        "template_9uuci2z",
        form.current,
        "tcTQ0Qdnq4TQZPKkJ"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  };
  return (
    <>
      <div className={`${styles.contactcontainer}`}>
        <div className={`${styles.contactshell}`}>
          <svg
            id="wave"
            style={{ transform: "rotate(180deg)", transition: "0.3s" }}
            viewBox="0 0 1440 360"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
                <stop stop-color="rgba(31, 41, 55, 1)" offset="0%"></stop>
                <stop stop-color="rgba(124, 210, 249, 1)" offset="100%"></stop>
              </linearGradient>
            </defs>
            <path
              style={{ transform: "translate(0, 0px)", opacity: "1" }}
              fill="url(#sw-gradient-0)"
              d="M0,324L60,276C120,228,240,132,360,108C480,84,600,132,720,156C840,180,960,180,1080,180C1200,180,1320,180,1440,168C1560,156,1680,132,1800,156C1920,180,2040,252,2160,288C2280,324,2400,324,2520,276C2640,228,2760,132,2880,120C3000,108,3120,180,3240,180C3360,180,3480,108,3600,102C3720,96,3840,156,3960,180C4080,204,4200,192,4320,186C4440,180,4560,180,4680,156C4800,132,4920,84,5040,60C5160,36,5280,36,5400,72C5520,108,5640,180,5760,210C5880,240,6000,228,6120,192C6240,156,6360,96,6480,78C6600,60,6720,84,6840,102C6960,120,7080,132,7200,126C7320,120,7440,96,7560,126C7680,156,7800,240,7920,234C8040,228,8160,132,8280,126C8400,120,8520,204,8580,246L8640,288L8640,360L8580,360C8520,360,8400,360,8280,360C8160,360,8040,360,7920,360C7800,360,7680,360,7560,360C7440,360,7320,360,7200,360C7080,360,6960,360,6840,360C6720,360,6600,360,6480,360C6360,360,6240,360,6120,360C6000,360,5880,360,5760,360C5640,360,5520,360,5400,360C5280,360,5160,360,5040,360C4920,360,4800,360,4680,360C4560,360,4440,360,4320,360C4200,360,4080,360,3960,360C3840,360,3720,360,3600,360C3480,360,3360,360,3240,360C3120,360,3000,360,2880,360C2760,360,2640,360,2520,360C2400,360,2280,360,2160,360C2040,360,1920,360,1800,360C1680,360,1560,360,1440,360C1320,360,1200,360,1080,360C960,360,840,360,720,360C600,360,480,360,360,360C240,360,120,360,60,360L0,360Z"
            ></path>
          </svg>
        </div>
        <div className={`${styles.contactbox}`}>
          <h1 className="text-white text-xl text-center mb-2">
            Connect With us
          </h1>
          <form ref={form} onSubmit={sendEmail}>
            <input
              style={{ border: " 1px solid rgba(0, 255, 255, 0.58)" }}
              type="text"
              placeholder="Enter Your Name"
              className="p-3 border-1 "
              required
              name="user_name"
            />
            <input
              style={{ border: " 1px solid rgba(0, 255, 255, 0.58)" }}
              type="email"
              placeholder="Enter Your Email"
              name="user_email"
              className="p-3"
              required
            />
            <textarea
              style={{ border: " 1px solid rgba(0, 255, 255, 0.58)" }}
              name="message"
              id=""
              cols="37"
              rows="5"
              required
              placeholder="Enter Your message"
            ></textarea>
            <button type="submit">Send</button>
          </form>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Contact;

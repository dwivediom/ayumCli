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
        <div className={`${styles.contactshell}`}></div>
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

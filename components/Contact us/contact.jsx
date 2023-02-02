import React, { useState } from "react";
import styles from "../../styles/contact.module.css";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
const Footer = dynamic(() => import("../Footer"));

const Contact = () => {
  const form = useRef();
  const [loading, setloading] = useState(false);

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
      <div className={`${styles.maincontact}`}>
        <div className={`${styles.contactimg}`}>
          <img src="/contact2.jpg" alt="" />
          <h2>Health and healing, strengthened by partnership</h2>
        </div>
        <div className={`${styles.contactform}`}>
          <h1>Contact Us</h1>
          <form ref={form} onSubmit={sendEmail}>
            <input type="text" placeholder="Enter Your Name" name="user_name" />
            <input
              type="email"
              placeholder="Enter Your Email"
              name="user_email"
            />
            <textarea
              name="message"
              id=""
              cols="37"
              rows="5"
              placeholder="Enter Your message"
            ></textarea>
            <button className="send_btn" type="submit">
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
      <div className={`${styles.footercontact}`}>
        <Footer />
      </div>
    </>
  );
};

export default Contact;

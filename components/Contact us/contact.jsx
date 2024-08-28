import React, { useState } from "react";
import styles from "../../styles/contact.module.css";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { useEffect } from "react";
const Footer = dynamic(() => import("../Footer"));

const Contact = () => {
  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    let indexbox = document.getElementById("contactpage");
    // console.log(indexbox.scrollTop);
    indexbox.addEventListener("scroll", () => {
      let scrollTop = indexbox.scrollTop;
      if (scrollTop > 0) {
        setscrollbox(false);
      } else {
        setscrollbox(true);
      }
    });
  }, []);
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
      <div
        style={{
          zIndex: "-10",
        }}
        id="contactpage"
        className={`${styles.maincontact}`}
      >
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
        <div className={`${styles.footercontact}`}>{/* <Footer /> */}</div>
      </div>
    </>
  );
};

export default Contact;

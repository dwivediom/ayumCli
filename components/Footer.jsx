import React from "react";
import styles from "../styles/footer.module.css";
const Footer = () => {
  return (
    <div className={styles.footercontainer}>
      <div>
        <h2 className="font-bold text-gray-200">General</h2>
        <ul className={styles.list}>
          <li>Home</li>
          <li>Contact us</li>
          <li>Blog</li>
          <li>About us</li>
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-gray-200">Socials</h2>
        <ul className={styles.list}>
          <li>Instagram</li>
          <li>Linkedin</li>
          <li>Facebook</li>
          <li>Twitter</li>
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-gray-200">Our Services</h2>
        <ul className={styles.list}>
          <li>Medicine Delivery</li>
          <li>Lab Tests</li>
          <li>Doctor Appointments</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;

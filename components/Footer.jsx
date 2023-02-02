import React from "react";
import styles from "../styles/footer.module.css";
const Footer = () => {
  return (
    <div className={styles.footercontainer}>
      <div className={styles.footc1}></div>
      <div className={styles.footc2}></div>
      <div className={styles.footerboxes}>
        <h2>Socials</h2>
        <div>
          <img src="https://img.icons8.com/3d-fluency/94/null/instagram-new.png" />
          <a
            rel="noreferrer"
            href="https://www.instagram.com/ayum_health/"
            target={"_blank"}
          >
            <span>Instagram</span>
          </a>
        </div>
        <div>
          <img src="https://img.icons8.com/3d-fluency/94/null/facebook-circled.png" />
          <a
            rel="noreferrer"
            href="https://www.instagram.com/ayum_health/"
            target={"_blank"}
          >
            <span>Facebook</span>
          </a>
        </div>
        <div>
          <img src="https://img.icons8.com/3d-fluency/94/null/twitter-circled.png" />
          <a
            rel="noreferrer"
            href="https://twitter.com/ayum_health"
            target={"_blank"}
          >
            <span>Twitter</span>{" "}
          </a>
        </div>
        <div>
          <img src="https://img.icons8.com/3d-fluency/94/null/linkedin.png" />
          <a
            rel="noreferrer"
            href="https://www.linkedin.com/in/ayum-in-263828257/"
          >
            <span>Linkedin</span>
          </a>
        </div>
      </div>
      <div className={styles.footerboxes}>
        <h2>Our Services</h2>
        <div>
          <img src="https://img.icons8.com/external-justicon-flat-gradient-justicon/64/null/external-appointment-telemedicine-justicon-flat-gradient-justicon.png" />
          <span>Online Appointment</span>
        </div>
        <div>
          <img src="https://img.icons8.com/fluency/96/null/appointment-scheduling.png" />
          <span>Patient Management</span>
        </div>
        <div>
          <img src="https://img.icons8.com/external-flat-berkahicon/64/null/external-Lab-Test-healthcare-flat-berkahicon.png" />
          <span>Online Lab Test</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

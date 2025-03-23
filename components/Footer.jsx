import React, { useContext, useState } from "react";
import styles from "../styles/footer.module.css";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
const Footer = () => {
  const router = useRouter();
  const { lang, setadminmode } = useContext(AccountContext);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        className={styles.footercontainer}
      >
        {/* <p
          style={{
            fontSize: "10px",
            paddingLeft: "3px",
            color: "#005E6D",
            textAlign: "center",
          }}
        >
          * Platform Pricing starts from ₹200/Appointment and can go above as
          per{" doctor's"} requirement
        </p> */}
        <div className={styles.footc1}></div>
        <div className={styles.footc2}></div>
        <div>
          <div className={styles.footerboxes}>
            <a href="/termsconditions">Terms & conditions</a>
            <a href="/PrivacyPolicy">Privacy policy</a>

            <a href="/refundpolicy">Refund policy</a>
            <span
              onClick={() => {
                // setadmindialog(true);
                setadminmode(true);
              }}
            >
              Version 0.0 / Online Appointments
            </span>
          </div>
          <div
            style={{
              padding: "0px 5px",
              background: "var(--surface-100)",
            }}
          >
            <p style={{ textAlign: "center", fontWeight: "600" }}>Socials</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
              }}
            >
              <div>
                <a
                  rel="noreferrer"
                  href="https://www.instagram.com/ayum_health/"
                  target={"_blank"}
                  style={{ textDecoration: "none", color: "var(--orange-600)" }}
                >
                  <span>
                    {lang == "en" ? English.instagram : Hindi.instagram}
                  </span>
                </a>
              </div>
              <div>
                <a
                  rel="noreferrer"
                  href="https://www.instagram.com/ayum_health/"
                  target={"_blank"}
                  style={{ textDecoration: "none", color: "var(--blue-600)" }}
                >
                  <span>
                    {lang == "en" ? English.facebook : Hindi.facebook}
                  </span>
                </a>
              </div>
              <div>
                {/* <Image
                width={30}
                height={30}
                alt="Twitter"
                src="https://img.icons8.com/3d-fluency/94/null/twitter-circled.png"
              /> */}
                <a
                  rel="noreferrer"
                  href="https://twitter.com/ayum_health"
                  target={"_blank"}
                  style={{ textDecoration: "none", color: "var(--black-600)" }}
                >
                  <span>{lang == "en" ? English.twitter : Hindi.twitter}</span>{" "}
                </a>
              </div>
              <div>
                {/* <Image
                width={30}
                height={30}
                alt="Linkedin"
                src="https://img.icons8.com/3d-fluency/94/null/linkedin.png"
              /> */}
                <a
                  rel="noreferrer"
                  href="https://www.linkedin.com/in/ayum-in-263828257/"
                  style={{ textDecoration: "none", color: "var(--blue-800)" }}
                >
                  <span>
                    {lang == "en" ? English.linkedin : Hindi.linkedin}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "-3rem",
          height: "4rem",
          paddingBottom: "10rem",
        }}
      >
        <div className="text-center  text-sm  ">
          &#169; 2024 Ayum Healthcare Private Ltd. , Inc. All rights are
          Reserved
        </div>
      </div>
    </>
  );
};

export default Footer;

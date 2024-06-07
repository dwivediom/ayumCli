import React, { useContext, useState } from "react";
import styles from "../styles/footer.module.css";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { useRouter } from "next/router";
const Footer = () => {
  const router = useRouter();
  const { lang, setadminmode } = useContext(AccountContext);
  return (
    <>
      <div className={styles.footercontainer}>
        <div className={styles.footc1}></div>
        <div className={styles.footc2}></div>
        <div className={styles.footerboxes}>
          <h2>{lang == "en" ? English.socials : Hindi.socials}</h2>
          <div>
            <Image
              width={30}
              height={30}
              alt="instagram"
              src="https://img.icons8.com/3d-fluency/94/null/instagram-new.png"
            />
            <a
              rel="noreferrer"
              href="https://www.instagram.com/ayum_health/"
              target={"_blank"}
            >
              <span>{lang == "en" ? English.instagram : Hindi.instagram}</span>
            </a>
          </div>
          <div>
            <Image
              width={30}
              height={30}
              alt="Facebook"
              src="https://img.icons8.com/3d-fluency/94/null/facebook-circled.png"
            />
            <a
              rel="noreferrer"
              href="https://www.instagram.com/ayum_health/"
              target={"_blank"}
            >
              <span>{lang == "en" ? English.facebook : Hindi.facebook}</span>
            </a>
          </div>
          <div>
            <Image
              width={30}
              height={30}
              alt="Twitter"
              src="https://img.icons8.com/3d-fluency/94/null/twitter-circled.png"
            />
            <a
              rel="noreferrer"
              href="https://twitter.com/ayum_health"
              target={"_blank"}
            >
              <span>{lang == "en" ? English.twitter : Hindi.twitter}</span>{" "}
            </a>
          </div>
          <div>
            <Image
              width={30}
              height={30}
              alt="Linkedin"
              src="https://img.icons8.com/3d-fluency/94/null/linkedin.png"
            />
            <a
              rel="noreferrer"
              href="https://www.linkedin.com/in/ayum-in-263828257/"
            >
              <span>{lang == "en" ? English.linkedin : Hindi.linkedin}</span>
            </a>
          </div>
        </div>
        <div className={styles.footerboxes}>
          <h2>{lang == "en" ? English.ourservice : Hindi.ourservice}</h2>
          <div>
            <Image
              width={30}
              height={30}
              alt="Online Appointment"
              src="https://img.icons8.com/external-justicon-flat-gradient-justicon/64/null/external-appointment-telemedicine-justicon-flat-gradient-justicon.png"
            />
            <span>{lang == "en" ? English.onlineappo : Hindi.onlineappo}</span>
          </div>
          <div>
            <Image
              width={30}
              height={30}
              alt="Patient Management"
              src="https://img.icons8.com/fluency/96/null/appointment-scheduling.png"
            />
            <span>
              {lang == "en" ? English.patientmanage : Hindi.patientmanage}
            </span>
          </div>
          <div
            onClick={() => {
              // setadmindialog(true);
              setadminmode(true);
            }}
          >
            <Image
              width={30}
              height={30}
              alt="Version 0.0"
              src="https://img.icons8.com/3d-fluency/94/documents.png"
            />
            <span>Version 0.0</span>
          </div>
          <div onClick={() => router.push("/ChatSection")}>
            <Image
              width={30}
              height={30}
              alt="Online Lab Tests"
              src="https://img.icons8.com/external-flat-berkahicon/64/null/external-Lab-Test-healthcare-flat-berkahicon.png"
            />
            <span>
              {lang == "en" ? English.onlinelabtest : Hindi.onlinelabtest}
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "-3rem",
          width: "100%",
          height: "4rem",
          paddingBottom: "6rem",
        }}
        className="text-center  text-sm  "
      >
        &#169; 2024 Ayum Healthcare Private Ltd. , Inc. All rights are Reserved
      </div>
    </>
  );
};

export default Footer;

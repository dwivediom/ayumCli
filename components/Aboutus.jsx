import React from "react";
import Footer from "./Footer";
import Image from "next/image";
import styles from "../styles/about.module.css";

const Aboutus = () => {
  return (
    <>
      <div className={styles.aboutContainer}>
        <div className={styles.aboutShell}>
          <h1 className={styles.mainh1}>About Us</h1>
          <p className={styles.maindesc}>
            <span className={styles.head2}>We Are Ayum .</span> We are the Team
            of Passionate Developers and Engineers including some names as Om
            dhar Dwivedi , Anurag Singh , Om dwivedi etc. . Ayum is an One Stop
            Online platform that provides the facility to Book Appointments and
            using Ayum you can also get your Lab tests report in your smartphone
            . Ayum makes the hectic procedure of booking doctor's appointement
            and getting lab tests report into an simple task . we bring
            innovation and technology in the health care sector . we are
            passionate about making peoples live better.
          </p>
          <div className={styles.doctrust}>
            <div>
              Doctors Use Ayum For Handling Patients Easily
              <span>
                Using Ayum doctors can easily take appointments from user and
                with simple and interactive interface they can also analyze
                their buisness growth{" "}
              </span>
            </div>
            <Image
              style={{ marginLeft: "2rem" }}
              width={"190px"}
              height={"320px"}
              src={"/doc.png"}
            />
          </div>
          <div className={styles.doctrust}>
            <Image
              style={{ transform: "scaleX(-1)", marginRight: "2rem" }}
              width={"200px"}
              height={"320px"}
              src={"/man.png"}
            />
            <div>
              People use Ayum for Booking Appointment
              <span>
                With Ayum anyone can book the appointment slot with their
                desired doctor in just one click no need to go to doctors office
                or call someone to do it
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Aboutus;

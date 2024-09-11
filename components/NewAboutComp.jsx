import React from "react";
import styles from "../styles/newAbout.module.css";
import Image from "next/image";
import Footer from "./Footer";

const NewAboutComp = () => {
  return (
    <div style={{ height: "100%" }}>
      <div className={styles.firstsec}>
        <div className={styles.about_welcome}>
          <span>
            Welcome To
            <span
              style={{
                color: "rgb(0, 145, 145)",
                fontSize: "2.5rem",
              }}
            >
              {"   "}Ayum
            </span>{" "}
          </span>{" "}
          <br />
          Meet doctors without wasting your{" "}
          <span
            style={{
              color: "rgb(0, 145, 145)",
              fontSize: "1.1rem",
            }}
          >
            Precious time!
          </span>
          <br />
          Have any lab test's at{" "}
          <span
            style={{
              color: "rgb(0, 145, 145)",
              fontSize: "1.1rem",
            }}
          >
            30% to 50% off
          </span>{" "}
          <br />
          Choose Ayum , India's way of{" "}
          <span
            style={{
              color: "rgb(0, 145, 145)",
              fontSize: "1.1rem",
            }}
          >
            Taking appointments.
          </span>
        </div>
        <div className={styles.about_blood}>
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Also India's Most Efficient Virtual Blood Bank System ❤️💙
          </span>
          <br />
          You Can do your{" "}
          <span
            style={{
              color: "red",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Blood request{" "}
          </span>{" "}
          , <br /> We will take care that your request reach our huge community
          of
          <span
            style={{
              color: "rgb(0, 145, 145)",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            {" "}
            Life savers
          </span>{" "}
          <br /> Then you will be notified as anyone respond to your request in
          the Ayum app{" "}
        </div>
      </div>

      <div className="text-center mt-[8rem]">
        <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-black mb-4">
          What We Provide ✅
        </h1>
      </div>
      <div className={styles.about_provide}>
        <div
          style={{
            width: "48%",
          }}
        >
          <h3>To Patients</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",

              flexDirection: "column",
            }}
          >
            <div className="p-2  w-full ">
              <div className="bg-cyan-400  rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  Easy & Fast Doctor Appointment Booking
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-cyan-400 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  Current Running Number at Clinic
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-red-600  rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-white">
                  Reach To Your Blood Request With Our Huge Community
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-cyan-400  rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  30% to 50% Off at Any Lab Test & Home Sample Collection
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-cyan-400  rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  Providing All Reports in Ayum's Modern Chat
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "48%",
          }}
        >
          <h3>
            To <span className="">Doctors</span>{" "}
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              flexDirection: "column",
            }}
          >
            <div className="p-2  w-full ">
              <div className="bg-cyan-400 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  Best Software Interface To Handle Patients Easily
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-cyan-400  rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  Complete Dashboard To Handle and Analyze Their Clinic Growth
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-red-600 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-white">
                  Can Have Reach Over 1 Lakh+ Patients
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-cyan-400  rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  Feature To Send Reports To Patients Direct From The App
                </span>
              </div>
            </div>
            <div className="p-2  w-full">
              <div className="bg-cyan-400  rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-bold text-black">
                  And All These Services Are Free! For Doctors
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default NewAboutComp;

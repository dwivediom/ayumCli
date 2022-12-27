import React from "react";
import Footer from "./Footer";
import styles from "../styles/newAbout.module.css";

const Aboutus = () => {
  return (
    <>
      <div className={`${styles.aboutbox}`}>
        <section
          style={{ height: "50vh" }}
          className="text-gray-400 bg-gray-900 body-font"
        >
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
                We are Team Ayum
              </h1>
              <p className="lg:w-2/3 mx-auto   text-base">
                We are the Team of Passionate Developers and Engineers including
                some names as Om dhar Dwivedi , Anurag Singh , Om dwivedi etc. .
                Ayum is an One Stop Online platform that provides the facility
                to Book Appointments and using Ayum you can also get your Lab
                tests report in your smartphone . Ayum makes the hectic
                procedure of booking doctor&apos;s appointement and getting lab
                tests report into an simple task . we bring innovation and
                technology in the health care sector . we are passionate about
                making peoples live better.
              </p>
            </div>
          </div>
        </section>
        <section className="text-gray-400 bg-gray-900 body-font mt-20">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-5">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-white mb-4">
                What we Provide
              </h1>
            </div>
            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                  <svg
                    fill="none"
                    stroke="aqua"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font font-medium text-white">
                    Easy Doctor Appointment Booking Service
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                  <svg
                    fill="none"
                    stroke="aqua"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font font-medium text-white">
                    Realtime Running Slot No.
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                  <svg
                    fill="none"
                    stroke="aqua"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font font-medium text-white">
                    Simple Interface for Doctors to Handle Patients
                  </span>
                </div>
              </div>

              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                  <svg
                    fill="none"
                    stroke="aqua"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font font-medium text-white">
                    Easy Appointment Booking for Lab Test's
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                  <svg
                    fill="none"
                    stroke="aqua"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font font-medium text-white">
                    Providing Lab Reports in Smartphone's
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                  <svg
                    fill="none"
                    stroke="aqua"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font font-medium text-white">
                    Providing all the Services for Free!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          style={{ backgroundColor: "#111827" }}
          className="text-center mb-5 mt-5"
        >
          <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-white mb-4">
            Ayum Gallery Pictures & Recommendations
          </h1>
        </div>
        <div
          style={{ backgroundColor: "#111827" }}
          className="flex flex-wrap -m-4"
        >
          <div className="lg:w-1/3 sm:w-1/2 p-4">
            <div style={{ height: "230px" }} className="flex relative">
              <img
                alt="gallery"
                className="absolute inset-0 w-full h-full  object-cover object-center"
                src="https://i.postimg.cc/gcR1c9ss/Whats-App-Image-2022-11-08-at-6-22-10-PM.jpg"
              />
              <div
                style={{ transition: "0.5s all" }}
                className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100"
              >
                <h2 className="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">
                  Recommeded by Dr. BL mishra , CMHO Rewa, Sidhi.
                </h2>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 sm:w-1/2 p-4">
            <div
              style={{ height: "230px", transition: "1s all" }}
              className="flex relative"
            >
              <img
                alt="gallery"
                className="absolute inset-0 w-full h-full object-cover object-center"
                src="https://i.postimg.cc/rsXVdS7P/Whats-App-Image-2022-11-07-at-6-59-20-PM.jpg"
              />
              <div
                style={{ transition: "0.5s all" }}
                className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100"
              >
                <h2 className="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">
                  Recommeded by Dr. Dheerendra Mishra , MD , DNB (Asso. Member
                  of International headache society , London)
                </h2>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 sm:w-1/2 p-4">
            <div style={{ height: "230px" }} className="flex relative">
              <img
                alt="gallery"
                className="absolute inset-0 w-full h-full object-cover object-center"
                src="https://i.postimg.cc/rFgTcXyb/Whats-App-Image-2022-12-22-at-10-49-15-AM.jpg"
              />
              <div
                style={{ transition: "0.5s all" }}
                className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100"
              >
                <h2 className="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">
                  Presented Ayum as Startup in Startup hackathon at Jhanshi and
                  came in Top 15 startups of Uttar Pradesh .
                </h2>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 sm:w-1/2 p-4">
            <div style={{ height: "230px" }} className="flex relative">
              <img
                alt="gallery"
                className="absolute inset-0 w-full h-full object-cover object-top"
                src="https://i.postimg.cc/Fs6P0DTz/Whats-App-Image-2022-12-22-at-10-49-15-AM-2.jpg"
              />
              <div
                style={{ transition: "0.5s all" }}
                className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100"
              >
                <h2 className="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">
                  Anurag Singh & Om dhar Dwivedi at Jhansi Hackathon
                </h2>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 sm:w-1/2 p-4">
            <div style={{ height: "230px" }} className="flex relative">
              <img
                alt="gallery"
                className="absolute inset-0 w-full h-full object-cover object-center"
                src="https://i.postimg.cc/L4wfTwFc/Whats-App-Image-2022-12-22-at-10-49-15-AM-1.jpg"
              />
              <div
                style={{ transition: "0.5s all" }}
                className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100"
              >
                <h2 className="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">
                  Presented Ayum as Startup in Startup hackathon at Jhanshi and
                  came in Top 15 startups of Uttar Pradesh .
                </h2>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Aboutus;

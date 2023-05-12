import React, { useContext, useEffect } from "react";
import Footer from "./Footer";
import styles from "../styles/newAbout.module.css";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";

const Aboutus = () => {
  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    let indexbox = document.getElementById("aboutpage");
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
  return (
    <>
      <div id="aboutpage" className={`${styles.aboutbox}`}>
        <section
          style={{ height: "80vh" }}
          className="text-black bg-white body-font"
        >
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-black">
                We are Team Ayum
              </h1>
              <p className="lg:w-2/3 mx-auto ">
                <div className="text-cyan-600 text-center mb-3">
                  Welcome to Ayum - your go-to platform for convenient
                  healthcare
                </div>
                Our company was founded with a mission to revolutionize the way
                people approach healthcare by providing a comprehensive and
                user-friendly platform for booking doctor appointments, managing
                patient information, and accessing essential medical resources.
                With Ayum, users can easily schedule appointments with qualified
                doctors and healthcare professionals from the comfort of their
                own home, without having to deal with the hassle of long wait
                times or scheduling conflicts. Our platform also allows doctors
                to manage patient information and streamline their practice,
                making it easier than ever to provide high-quality care. In
                addition to appointment scheduling, Ayum also provides access to
                important medical resources such as blood bank information, lab
                reports, and pathology reports. Our app allows users to access
                these resources directly from their phone, making it more
                convenient than ever to stay on top of their health and
                wellness. At Ayum, we are committed to providing our users with
                the highest level of convenience and accessibility when it comes
                to healthcare. We are constantly innovating and improving our
                platform to ensure that our users have access to the best
                possible care. Join us today and experience the future of
                healthcare.
              </p>
            </div>
          </div>
        </section>
        <section className="text-black bg-white body-font mt-20">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-5">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-black mb-4">
                What We Provide
              </h1>
            </div>
            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-cyan-700 rounded flex p-4 h-full items-center">
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
                  <span className="title-font font-medium text-white">
                    Easy Doctor Appointment Booking Service
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
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
                  <span className="title-font font-medium text-white">
                    Blood and Blood Banks Updated Information
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-pink-600 rounded flex p-4 h-full items-center">
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
                  <span className="title-font font-medium text-white">
                    Realtime Running Slot No.
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-orange-600 rounded flex p-4 h-full items-center">
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
                  <span className="title-font font-medium text-white">
                    Simple Interface for Doctors to Handle Patients
                  </span>
                </div>
              </div>

              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-yellow-600 rounded flex p-4 h-full items-center">
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
                  <span className="title-font font-medium text-white">
                    Easy Appointment Booking for Lab Tests
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-green-600 rounded flex p-4 h-full items-center">
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
                  <span className="title-font font-medium text-white">
                    Providing Lab Reports in Smartphones
                  </span>
                </div>
              </div>
              <div className="p-2 sm:w-1/2 w-full">
                <div className="bg-blue-700 rounded flex p-4 h-full items-center">
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
                  <span className="title-font font-medium text-white">
                    Providing all the Services for Free!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className=" bg-gray-300">
          <div className=" bg-gray-300 text-center mb-5 mt-5 text-black  pt-2">
            <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-black  mb-4">
              Ayum Gallery Pictures & Recommendations
            </h1>
          </div>
          <div className=" bg-gray-300 flex flex-wrap  m-4">
            <div className="lg:w-1/3 sm:w-1/2 p-4">
              <div style={{ height: "230px" }} className="flex relative">
                <img
                  alt="gallery"
                  className="absolute inset-0 w-full h-full object-cover object-center"
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
                    Presented Ayum as Startup in Startup hackathon at Jhanshi
                    and came in Top 15 startups of Uttar Pradesh .
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
                    Presented Ayum as Startup in Startup hackathon at Jhanshi
                    and came in Top 15 startups of Uttar Pradesh .
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Aboutus;

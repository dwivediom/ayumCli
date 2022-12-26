import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { bgSecColor, bgPriColor } from "./theam/theam";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

const Navbar = () => {
  const [profile, setprofile] = useState(false);
  const [navitem, setnavitem] = useState(false);
  const [collapseopen, setcollapse] = useState(false);

  const clickprofile = () => {
    setprofile((profile) => !profile);
  };
  const clicknavitem = () => {
    setnavitem((navitem) => !navitem);
  };

  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    if (!router.isServer) {
      window.addEventListener("beforeinstallprompt", (event) => {
        // Prevent the default prompt
        event.preventDefault();
        // Save the event so it can be triggered later
        setDeferredPrompt(event);
      });
    }
  }, [router.isServer]);
  // Listen for the beforeinstallprompt event and save the prompt

  const showInstallPrompt = () => {
    // Check if there is a saved event
    if (deferredPrompt) {
      if (typeof deferredPrompt === "object") {
        // Check if the app property exists
        if (deferredPrompt.hasOwnProperty("app")) {
          // Apply custom styles to the prompt
          deferredPrompt.app.setStyle({
            width: "375px",
            height: "667px",
            backgroundColor: "#fafafa",
            border: "1px solid #999",
          });
        }
      }
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        // Clear the saved event
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <nav
        style={{
          boxShadow: "0px 3px 10px rgba(0,0,0,0.8) ",
        }}
        className={`${bgSecColor} fixed top-0 z-10 w-full  `}
      >
        <div className=" mx-auto max-w-7xl px-1 sm:px-2  lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => {
                  clicknavitem(), setcollapse(!collapseopen);
                }}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {collapseopen ? (
                  <svg
                    fill="#f32f"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 30"
                    width="20px"
                    height="20px"
                  >
                    {" "}
                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="aqua"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
              {/* <div
                onClick={showInstallPrompt}
                style={{
                  color: "#00f445",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04M13.46 12.29L11.21 15.83L9 13.53L6 17H18L13.46 12.29M19 18H6C3.79 18 2 16.21 2 14C2 11.79 3.79 10 6 10H6.71C7.37 7.69 9.5 6 12 6C15.04 6 17.5 8.46 17.5 11.5V12H19C20.66 12 22 13.34 22 15C22 16.66 20.66 18 19 18M16.5 16.25C16.5 14.75 13.5 14 12 14C10.5 14 7.5 14.75 7.5 16.25V17H16.5V16.25Z"
                    fill="#00ff44"
                  />
                </svg>
                <span style={{ marginTop: "-0.7rem" }}>&darr;</span>
              </div> */}
              <div onClick={showInstallPrompt} style={{ marginLeft: "10px" }}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAW0lEQVR4nGNgGDngVeVRhldV/yG48jANLKj6j4JHLcAAr0aDaPgF0cuqcgxDceN6WlpST0uf1FNmOH5LqGQ4dkuobDgMvKxsAONRQBvwiuhM9Z8oTH8LGIYoAAAtpRMLOlH1GgAAAABJRU5ErkJggg=="
                  alt="download app"
                ></img>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
              className="flex flex-1 items-center justify-center  sm:items-stretch sm:justify-start"
            >
              <div onClick={() => router.push("/")}>
                <div className="flex flex-shrink-0 items-center">
                  <span className="block h-10 mr-6  lg:hidden lg:m-0 lg:h-0 lg:w-0">
                    <Image
                      style={{ marginTop: "-10px" }}
                      width={"100px"}
                      height={"35px"}
                      src={`/ayumTranparent.png`}
                      loading="eager"
                      alt="Ayum"
                    />
                  </span>
                  <span className="hidden h-8 w-auto lg:block">
                    <Image
                      width={"100px"}
                      height={"30px"}
                      src={`/ayumTranparent.png`}
                      alt="Ayum"
                      loading="eager"
                    />
                  </span>
                </div>
              </div>
              <div className=" hidden sm:ml-10 md:block sm:block border-1 border-red-500">
                <div>
                  <a
                    onClick={() => Router.push("/Contact")}
                    style={{
                      border: "1px solid rgba(39, 239, 245, 0.3)",
                      cursor: "pointer",
                      transition: "0.5s all",
                    }}
                    className=" text-white px-2 py-1 rounded-md text-sm font-medium hover:bg-sky-500 hover:border-gray-300"
                    aria-current="page"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
              <div className=" hidden sm:ml-10 md:block sm:block border-1 border-red-500">
                <div>
                  <a
                    onClick={() => Router.push("/About")}
                    style={{
                      border: "1px solid rgba(39, 239, 245, 0.3)",
                      cursor: "pointer",
                      transition: "0.5s all",
                    }}
                    className=" text-white px-2 py-1 rounded-md text-sm font-medium hover:text-white  hover:bg-sky-500 hover:border-gray-300"
                    aria-current="page"
                  >
                    About Us
                  </a>
                </div>
              </div>
              <div className=" hidden sm:ml-10 md:block sm:block border-1 border-red-500">
                <button
                  onClick={showInstallPrompt}
                  className={`${styles.installbtn} text-white px-2 py-1 rounded-md text-sm font-medium`}
                >
                  Install App
                </button>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </button>

              {/* <!-- Profile dropdown --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    onClick={clickprofile}
                    className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full text-white text-center p-1  font-extrabold  bg-cyan-500">
                      P
                    </div>
                  </button>
                </div>

                {profile && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link href="/Doctor/createDocProfile">
                      <a
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-2"
                      >
                        Doctor update profile
                      </a>
                    </Link>

                    <Link href="/Doctor/DocRegistr">
                      <a
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-2"
                      >
                        Doctor Login/Registration
                      </a>
                    </Link>
                    <Link href="/User/UserRegistrationPage">
                      <a
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-2"
                      >
                        User Login/Registration
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden" id="mobile-menu">
          {navitem && (
            <>
              <div className={` space-y-1 px-2 pt-2 pb-3`}>
                <a
                  style={{
                    border: "1px solid rgba(39, 239, 245, 0.3)",
                    cursor: "pointer",
                    transition: "0.5s all",
                  }}
                  className=" bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-sky-500 hover:border-gray-300 "
                  aria-current="page"
                  onClick={() => router.push("/Contact")}
                >
                  Contact Us
                </a>
              </div>
              <div className="  space-y-1 px-2 pt-2 pb-3">
                <a
                  style={{
                    border: "1px solid rgba(39, 239, 245, 0.3)",
                    cursor: "pointer",
                    transition: "0.5s all",
                  }}
                  className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-sky-500 hover:border-gray-300"
                  aria-current="page"
                  onClick={() => router.push("/About")}
                >
                  About Us
                </a>
              </div>
              <div className=" space-y-1 px-2 ml-2 pt-2 pb-3">
                <button
                  onClick={showInstallPrompt}
                  className={`${styles.installbtn} text-white px-2 py-1 rounded-md text-sm font-medium`}
                >
                  Install App
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default React.memo(Navbar);

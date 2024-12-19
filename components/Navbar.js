import React, { useContext, useState } from "react";
import Head from "next/head";
import { bgSecColor, bgPriColor } from "./theam/theam";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import Image from "next/image";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { AccountContext } from "../context/AccountProvider";
import SignOutbtn from "./usersSection/SignOutbtn";
const Navbar = () => {
  const [navitem, setnavitem] = useState(false);
  const [profilepic, setprofilepic] = useState();
  const [loggedemail, setloggedemail] = useState();
  const [name, setname] = useState();
  const { lang, setlang } = useContext(AccountContext);
  const [mobile, setmobile] = useState(false);
  useEffect(() => {
    console.log(screen.width, "screen width hai");
    console.log(window.innerWidth, "windows width hai");
    if (window.innerWidth < 600) {
      setmobile(true);
    }

    return;
  }, []);

  const {
    threedotmodal,
    setthreedotmodal,
    signout,
    collapseopen,
    setcollapse,
  } = useContext(AccountContext);

  const clicknavitem = () => {
    setnavitem((navitem) => !navitem);
  };

  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const UserData = JSON.parse(localStorage.getItem("labuser"));
    if (UserData) {
      if (UserData.picture.includes("googleusercontent.com")) {
        const index = UserData.picture.indexOf("=");
        const result = UserData.picture.slice(0, index);
        setprofilepic(result);
      } else {
        setprofilepic(UserData.picture);
      }
      setloggedemail(UserData.email);
      setname(UserData.name);
    }
  }, [signout]);

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setShowInstallButton(false);
    } else {
      setShowInstallButton(true);
    }
  }, []);
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

  const [langbox, setlangbox] = useState(false);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <nav className={`${bgSecColor}  z-10 w-full  `}>
        <div className=" mx-auto max-w-7xl px-1 sm:px-2  lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                onMouseEnter={() => console.log("Enter button")}
                onMouseOut={() => {
                  setcollapse(false);
                }}
                onClick={() => {
                  setcollapse(!collapseopen);
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
            </div>
            <div
              className={` ${styles.navbarpc} flex flex-1 items-center justify-center  sm:items-stretch sm:justify-start`}
            >
              <div
                onClick={() => {
                  console.log("Home");
                  router.push("/");
                }}
                style={{
                  zIndex: 30,
                }}
              >
                <div className="flex flex-shrink-0 items-center">
                  <span className="block h-10 mr-6  lg:hidden lg:m-0 lg:h-0 lg:w-0">
                    <img
                      // width={250}
                      // height={200}
                      // layout="fill"
                      // objectFit="contain"
                      style={{
                        marginLeft: "-15px",
                      }}
                      className={styles.logoimg}
                      src={`/ayumtranparent1.svg`}
                      alt="Ayum"
                      loading="eager"
                    />
                    {/* <div className={styles.logoimg}></div> */}
                  </span>
                  <span className="hidden h-8 w-auto lg:block cursor-pointer">
                    <img
                      // width={250}
                      // height={200}

                      // layout="fill"
                      // objectFit="contain"
                      className={styles.logoimg}
                      src={`/ayumtranparent1.svg`}
                      alt="Ayum"
                      loading="eager"
                    />
                    {/* <div className={styles.logoimg}></div> */}
                  </span>
                </div>
              </div>
              <div
                style={{ marginLeft: "-2.7rem", display: "flex", gap: "10px" }}
              >
                <div
                  className={`  ${styles.navbtns}  hidden md:block sm:block `}
                >
                  <div>
                    <div
                      onClick={() => router.push("/Contact")}
                      style={{
                        border: "1px solid rgba(39, 239, 245, 0.3)",
                        cursor: "pointer",
                        transition: "0.5s all",
                        fontSize: "0.75rem",
                        marginLeft: "30px",
                      }}
                      className=" text-white px-2 py-1 rounded-md text-sm font-medium hover:bg-sky-500 hover:border-gray-300"
                      aria-current="page"
                    >
                      {lang == "en" ? English.contactus : Hindi.contactus}
                    </div>
                  </div>
                </div>

                <div
                  className={`  ${styles.navbtns}  hidden  md:block sm:block `}
                >
                  <div>
                    <div
                      onClick={() => router.push("/About")}
                      style={{
                        border: "1px solid rgba(39, 239, 245, 0.3)",
                        cursor: "pointer",
                        transition: "0.5s all",
                        fontSize: "0.75rem",
                      }}
                      className=" text-white px-2 py-1 rounded-md text-sm font-medium hover:text-white  hover:bg-sky-500 hover:border-gray-300"
                      aria-current="page"
                    >
                      {lang == "en" ? English.aboutus : Hindi.aboutus}
                    </div>
                  </div>
                </div>
                <div className={`${styles.navbtns} hidden md:block sm:block`}>
                  <a
                    href="https://play.google.com/store/apps/details?id=in.ayum.twa"
                    className={`${styles.installbtn} text-white  rounded-md text-sm font-medium`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={"/google.svg"}
                      width={100}
                      height={25}
                      alt="Install App"
                      title="Install App"
                    />
                  </a>
                </div>
                <div
                  className={`  ${styles.navbtns}  hidden  md:block sm:block `}
                >
                  <div>
                    <a
                      href={"https://www.doctor.ayum.in/"}
                      className={`${styles.doctorbtn} text-white rounded-md  font-medium`}
                    >
                      {lang == "en" ? English.ayumdoc : Hindi.ayumdoc}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="rounded-full bg-gray-100 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
                    className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    {
                      <Image
                        // onMouseOverCapture={() => console.log("Bahar aa gya")}
                        onMouseOut={() => mobile && setthreedotmodal(false)}
                        onClick={() => setthreedotmodal(!threedotmodal)}
                        style={{
                          borderRadius: "50%",
                        }}
                        src={!signout ? profilepic : "/deafaultpro.jpg"}
                        width={40}
                        height={38}
                        alt="Profile Pic"
                      />
                    }
                  </button>
                </div>
                {
                  <div
                    onMouseLeave={() => setthreedotmodal(false)}
                    style={{
                      display: !threedotmodal && "none",
                      minWidth: "7rem",
                      zIndex: "10",
                    }}
                    className={`${styles.popup}`}
                  >
                    {!signout && <div className="text-cyan-400">{name} </div>}

                    {!signout && (
                      <div className="text-cyan-400">
                        {loggedemail && loggedemail}{" "}
                      </div>
                    )}

                    <div
                      onClick={() => {
                        localStorage.setItem("locale", "hi");
                        setlang("hi");
                        setthreedotmodal(false);
                      }}
                      className="text-sm w-full text-white"
                    >
                      हिंदी
                    </div>

                    <div
                      onClick={() => {
                        localStorage.setItem("locale", "en");
                        setlang("en");
                        setthreedotmodal(false);
                      }}
                      className="text-sm w-full text-white"
                    >
                      English
                    </div>

                    {!signout && (
                      <div
                        onClick={() => router.push("/PrivacyPolicy")}
                        className="text-sm text-white w-full"
                      >
                        {lang == "en" ? English.terms : Hindi.terms}
                      </div>
                    )}

                    {!signout ? (
                      <SignOutbtn
                        text={lang == "en" ? English.signout : Hindi.signout}
                      />
                    ) : (
                      <div
                        onClick={() =>
                          router.push("/User/UserRegistrationPage")
                        }
                        className="text-sm w-full text-white bg-cyan-600"
                      >
                        {lang == "en" ? English.login : Hindi.login}
                      </div>
                    )}
                  </div>
                }
                {/* Popup */}
              </div>
            </div>
          </div>
        </div>

        <div
          className="sm:hidden"
          id="mobile-menu"
          style={{ padding: collapseopen && "1rem" }}
        >
          {collapseopen && (
            <>
              <div className={`${styles.mobilecoll} mt-4`}>
                <a
                  href="https://play.google.com/store/apps/details?id=in.ayum.twa"
                  rel="norefferer"
                  className={`${styles.installbtn} text-white rounded-md text-sm font-medium`}
                >
                  <Image
                    src={"/google.svg"}
                    width={"100%"}
                    height={30}
                    alt="Install App"
                    title="Install App"
                  />
                </a>
              </div>
              <div className={`${styles.mobilecoll} `}>
                <div>
                  <a
                    style={{
                      width: "92%",
                      margin: "auto",
                      marginTop: "20px",
                    }}
                    href={"https://www.doctor.ayum.in/"}
                    className={`${styles.doctorbtn} text-white rounded-md text-sm font-medium`}
                    aria-current="page"
                  >
                    {lang == "en" ? English.ayumdoc : Hindi.ayumdoc}
                  </a>
                </div>
              </div>

              <div className={`${styles.mobilecoll} `}>
                <a
                  className={`${styles.navitem} text-white rounded-md text-sm font-medium`}
                  // className=" bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-sky-500 hover:border-gray-300 "
                  aria-current="page"
                  onClick={() => {
                    router.push("/Contact");
                    setnavitem(false);
                    setcollapse(false);
                  }}
                >
                  {lang == "en" ? English.contactus : Hindi.contactus}
                </a>
              </div>
              <div className={`${styles.mobilecoll} `}>
                <a
                  className={`${styles.navitem} text-white rounded-md text-sm font-medium`}
                  // className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-sky-500 hover:border-gray-300"
                  aria-current="page"
                  onClick={() => {
                    router.push("/About");
                    setnavitem(false);
                    setcollapse(false);
                  }}
                >
                  {lang == "en" ? English.aboutus : Hindi.aboutus}
                </a>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default React.memo(Navbar);

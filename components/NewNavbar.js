import React, { useContext, useRef, useState } from "react";
import Head from "next/head";
import { bgSecColor, bgPriColor } from "./theam/theam";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
const Navbar = () => {
  const [navitem, setnavitem] = useState(false);
  const {
    dataispresent,
    setdataispresent,
    popup,
    setpopup,
    collapseopen,
    setcollapse,
  } = useContext(AccountContext);

  useEffect(() => {
    const Docdata2 = JSON.parse(localStorage.getItem("googleDocData"));
    if (Docdata2) {
      setdataispresent(true);
    }
  }, [popup, dataispresent]);
  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const router = useRouter();
  const items = [
    // {
    //   label: "Home",
    //   icon: "pi pi-home",
    // },
    // {
    //     label: 'Features',
    //     icon: 'pi pi-star'
    // },
    // {
    //     label: 'Projects',
    //     icon: 'pi pi-search',
    //     items: [
    //         {
    //             label: 'Core',
    //             icon: 'pi pi-bolt',
    //             shortcut: '⌘+S',
    //             template: itemRenderer
    //         },
    //         {
    //             label: 'Blocks',
    //             icon: 'pi pi-server',
    //             shortcut: '⌘+B',
    //             template: itemRenderer
    //         },
    //         {
    //             label: 'UI Kit',
    //             icon: 'pi pi-pencil',
    //             shortcut: '⌘+U',
    //             template: itemRenderer
    //         },
    //         {
    //             separator: true
    //         },
    //         {
    //             label: 'Templates',
    //             icon: 'pi pi-palette',
    //             items: [
    //                 {
    //                     label: 'Apollo',
    //                     icon: 'pi pi-palette',
    //                     badge: 2,
    //                     template: itemRenderer
    //                 },
    //                 {
    //                     label: 'Ultima',
    //                     icon: 'pi pi-palette',
    //                     badge: 3,
    //                     template: itemRenderer
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     label: 'Contact',
    //     icon: 'pi pi-envelope',
    //     badge: 3,
    //     template: itemRenderer
    // }
  ];

  const start = (
    <div>
      <div
        onClick={() => {
          setVisible(true);
        }}
        style={{
          position: "absolute",
          cursor: "pointer",
          left: "10px",
          top: "12px",
          zIndex: "1000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "teal",
        }}
      >
        {/* <span className="pi pi-bars"></span> */}
        <Button style={{ padding: "5px" }} label="" icon="pi pi-bars" />
      </div>

      <img
        alt="logo"
        style={{
          position: "absolute",
          alignSelf: "center",
          top: "-35px",
          cursor: "pointer",
          left: "50%",
          width: "140px",
          height: "140px",
          transform: "translate(-50%)",
        }}
        onClick={() => {
          router.push("/");
        }}
        src="/ayumlogormbg.png"
        height="40"
        className="mr-2"
      ></img>
    </div>
  );
  const menuLeft = useRef(null);
  const menuRight = useRef(null);
  const [userdata, setuserdata] = useState();
  useEffect(() => {
    const userData1 = JSON.parse(localStorage.getItem("labuser"));
    if (userData1) {
      setuserdata(userData1);
    }
  }, []);
  const toast = useRef();
  const barsmenu = [
    {
      label: "Contact us",
      icon: "pi ",
      command: () => {
        router.push("/Contact");
      },
    },
  ];
  const { lang, setlang } = useContext(AccountContext);
  const [usertoken, setusertoken] = useState();
  useEffect(() => {
    if (typeof window != "undefined") {
      let temp = window.localStorage.getItem("usertoken");
      setusertoken(temp);
    }
  }, []);
  const [itemsmenu, setitemsmenu] = useState([]);

  useEffect(() => {
    if (typeof window != "undefined") {
      let temp = localStorage.getItem("usertoken");
      setusertoken(temp);
      if (temp) {
        setitemsmenu([
          {
            label: userdata?.email,
            // icon: "pi pi-sign-out",
            command: () => {
              navigator.clipboard
                .writeText(userdata?.email)
                .then(() => {
                  // alert("Text copied to clipboard!");
                  toast.current.show({
                    severity: "info",
                    summary: "Copied",
                    detail: "Copied text to clipboard",
                    life: 3000,
                  });
                })
                .catch((err) => {
                  console.error("Failed to copy text: ", err);
                });
            },
          },
          {
            label: "Hindi",
            icon: () => {
              return (
                <span
                  style={{
                    marginLeft: "-5px",
                    marginRight: "5px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                    />
                  </svg>
                </span>
              );
            },
            command: () => {
              localStorage.setItem("locale", "hi");
              setlang("hi");
            },
          },
          {
            label: "English",
            icon: () => {
              return (
                <span style={{ marginLeft: "-5px", marginRight: "5px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                    />
                  </svg>
                </span>
              );
            },
            command: () => {
              localStorage.setItem("locale", "en");
              setlang("en");
            },
          },

          {
            label: "Profile",
            icon: "pi pi-user",
            command: () => {
              console.log("Hii");

              router.push("/profile");
            },
          },
          {
            label: "Settings",
            icon: "pi pi-cog",
            command: () => {
              router.push("/settings");
            },
          },
          {
            label: "Sign out",
            icon: "pi pi-sign-out",
            command: () => {
              console.log("Hii");
              let lang = localStorage.getItem("locale");
              let city = localStorage.getItem("city");

              localStorage.clear();
              sessionStorage.clear();

              document.cookie.split(";").forEach((cookie) => {
                document.cookie = cookie
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
                  );
              });

              localStorage.setItem("locale", lang);
              localStorage.setItem("city", city);
              router.push("/User/UserRegistrationPage");
              window.location.reload();
            },
          },
          ...itemsmenu,
        ]);
      } else {
        setitemsmenu([
          {
            label: "Hindi",
            icon: () => {
              return (
                <span
                  style={{
                    marginLeft: "-5px",
                    marginRight: "5px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                    />
                  </svg>
                </span>
              );
            },
            command: () => {
              localStorage.setItem("locale", "hi");
              setlang("hi");
            },
          },
          {
            label: "English",
            icon: () => {
              return (
                <span style={{ marginLeft: "-5px", marginRight: "5px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                    />
                  </svg>
                </span>
              );
            },
            command: () => {
              localStorage.setItem("locale", "en");
              setlang("en");
            },
          },

          {
            label: "Log in",
            icon: "pi pi-sign-out",
            command: () => {
              router.push("/User/UserRegistrationPage");
            },
          },
          // {
          //   label: "Export",
          //   icon: "pi pi-upload",
          // },
        ]);
      }
    }
  }, []);
  const [showNotification, setshowNotification] = useState(false);

  const end = (
    <div className="flex align-items-center gap-2">
      <Sidebar
        visible={showNotification}
        onHide={() => setshowNotification(false)}
        header="Notifications"
        position="right"
        style={{
          width: "22rem",
          padding: "0",
        }}
        className="nav-slider"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            overflow: "auto",
            padding: "0.5rem",
            width: "100%",
            // height: "100vh",
          }}
        >
          <div
            style={{
              height: "5rem",
              width: "100%",
              background: "var(--surface-50)",
              borderRadius: "12px",
              display: "flex",
              padding: "5px",
              alignItems: "center",
              gap: "5px",
              borderLeft: "3px solid rgb(5, 255, 84)",

              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                height: "100%",
                borderRadius: "12px",
                paddingTop: "0.5rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-badge-check"
                style={{ width: "25px", height: "25px" }}
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                Appointment at Dr Rakesh Patel Booked Successfully
              </span>
              <span style={{ fontSize: "14px" }}>Click to view.</span>
            </div>
          </div>
          <div
            style={{
              height: "5rem",
              width: "100%",
              background: "var(--surface-50)",
              borderRadius: "12px",
              display: "flex",
              padding: "5px",
              alignItems: "center",
              gap: "5px",
              borderLeft: "3px solid rgb(168, 5, 255)",

              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                height: "100%",
                borderRadius: "12px",
                paddingTop: "0.5rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-test-tube"
                style={{ width: "25px", height: "25px" }}
              >
                <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2" />
                <path d="M8.5 2h7" />
                <path d="M14.5 16h-5" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                Lab Test Report Recieved
              </span>
              <span style={{ fontSize: "14px" }}>Click to view.</span>
            </div>
          </div>
          <div
            style={{
              height: "5rem",
              width: "100%",
              background: "var(--surface-50)",
              borderRadius: "12px",
              display: "flex",
              padding: "5px",
              alignItems: "center",
              gap: "5px",
              borderLeft: "3px solid rgb(255, 201, 5)",

              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                height: "100%",
                borderRadius: "12px",
                paddingTop: "0.5rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-badge-check"
                style={{ width: "25px", height: "25px" }}
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                Your appointment with Dr. Rakesh Patel is Re-Scheduled.
              </span>
              <span style={{ fontSize: "14px" }}>Click to view.</span>
            </div>
          </div>
        </div>
      </Sidebar>
      {/* <Avatar
        image={
          userdata?.picture
            ? "https://images.unsplash.com/photo-1702884162674-b05320817c58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8"
            : "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        }
        shape="circle"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      /> */}
      <div
        style={{
          height: "35px",
          width: "35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          // background: "var(--surface-200)",
          position: "relative",
        }}
        onClick={() => {
          setshowNotification(true);
        }}
      >
        <span
          style={{
            position: "absolute",
            padding: "3px",
            height: "8px",
            width: "8px",
            top: "5px",
            right: "3px",
            height: "10px",
            width: "10px",
            borderRadius: "50%",
            background: "red",
          }}
        ></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
          style={{
            width: "28px",
            cursor: "pointer",
            height: "28px",
          }}
        >
          <path
            fill-rule="evenodd"
            d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {userdata?.picture && (
        <img
          onClick={(event) => menuLeft.current.toggle(event)}
          src={
            userdata?.picture
              ? userdata?.picture?.replace(/=s\d+-c/, "")
              : "https://i.pinimg.com/736x/c6/3b/a4/c63ba4abc256a03c3f3a830965c365ac.jpg"
          }
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          alt="user"
        />
      )}
      {!userdata?.picture && (
        <img
          onClick={(event) => menuLeft.current.toggle(event)}
          src={
            "https://i.pinimg.com/736x/c6/3b/a4/c63ba4abc256a03c3f3a830965c365ac.jpg"
          }
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          alt="user"
        />
      )}

      <Menu
        style={{ width: "fit-content" }}
        model={itemsmenu}
        popup
        ref={menuLeft}
        id="popup_menu_right"
      />
    </div>
  );
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Toast ref={toast} />
      <nav
        className={` fixed top-0 z-10 w-full left-0 `}
        style={{ zIndex: "100" }}
      >
        <div
          style={{
            boxShadow: "0 0 5px 7px rgba(0,0,0,0.05)",
            height: "3.5rem",
            overflow: "hidden",
            background: "white",
            position: "relative",
          }}
          className="card"
        >
          <Menubar
            style={{
              background: "white",
              opacity: 1,
              backdropFilter: "blur(10px)",
              zIndex: 100000000000,
            }}
            model={items}
            start={start}
            end={end}
          />
        </div>
        {/* <div className=" mx-auto max-w-7xl px-1 sm:px-2  lg:px-8">
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
                      width={100}
                      height={35}
                      src={`/ayumTranparent.png`}
                      loading="eager"
                      alt="Ayum"
                    />
                  </span>
                  <span className="hidden h-8 w-auto lg:block">
                    <Image
                      width={100}
                      height={30}
                      src={`/ayumTranparent.png`}
                      alt="Ayum"
                      loading="eager"
                    />
                  </span>
                </div>
              </div>
              <div className=" hidden sm:ml-10 md:block sm:block border-1 border-red-500">
                <div>
                  <div
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
                  </div>
                </div>
              </div>
              <div className=" hidden sm:ml-10 md:block sm:block border-1 border-red-500">
                <div>
                  <div
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
                  </div>
                </div>
              </div>
              <div className=" hidden sm:ml-10 md:block sm:block border-1 border-red-500">
                <a
                  href="https://play.google.com/store/apps/details?id=in.ayum.doctor.www.twa"
                  className={` text-white  rounded-md text-sm font-medium`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={"/google.svg"}
                    width={100}
                    height={30}
                    alt="Install App"
                    title="Install App"
                  />
                </a>
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


              {<AccountPopup />}
            </div>
          </div>
        </div> */}

        {/* <div className="sm:hidden" id="mobile-menu">
          {collapseopen && (
            <>
              <div className={`${styles.collapsebar}`}>
                <div className={` space-y-1 px-2 pt-2 pb-3`}>
                  <a
                    style={{
                      border: "1px solid rgba(39, 239, 245, 0.3)",
                      cursor: "pointer",
                      transition: "0.5s all",
                    }}
                    className=" bg-gray-900 text-white block p-2 rounded-md text-sm font-medium hover:bg-sky-500 hover:border-gray-300 "
                    aria-current="page"
                    onClick={() => {
                      router.push("/Contact");
                      setnavitem(false);
                      setcollapse(false);
                    }}
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
                    className="bg-gray-900 text-white block p-2 rounded-md text-sm font-medium hover:bg-sky-500 hover:border-gray-300"
                    aria-current="page"
                    onClick={() => {
                      router.push("/About");
                      setnavitem(false);
                      setcollapse(false);
                    }}
                  >
                    About Us
                  </a>
                </div>
                <div className=" space-y-1 px-2 ml-2 pt-2 pb-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=in.ayum.doctor.www.twa"
                    className={` text-white  rounded-md text-sm font-medium`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={"/google.svg"}
                      width={100}
                      height={30}
                      alt="Install App"
                      title="Install App"
                    />
                  </a>
                </div>
              </div>
            </>
          )}
        </div> */}
        <Sidebar
          position="left"
          visible={visible}
          onHide={() => {
            setVisible(false);
          }}
        >
          <div>
            <img
              alt="logo"
              style={{
                position: "absolute",
                alignSelf: "center",
                top: "-35px",
                cursor: "pointer",
                left: "45%",
                width: "140px",
                height: "140px",
                transform: "translate(-50%)",
              }}
              onClick={() => {
                router.push("/");
              }}
              src="/ayumlogormbg.png"
              height="40"
              className="mr-2"
            ></img>
          </div>
          {/* <div
            style={{
              display: "flex",
              gap: "5px",
              background:
                "linear-gradient(120deg,var(--purple-600),var(--purple-900))",
              padding: "1rem",
              marginBottom: "5px",
              borderRadius: "24px",
              cursor: "pointer",

              color: "white",
            }}
            onClick={() => {
              window.location.href =
                "https://play.google.com/store/apps/details?id=in.ayum.doctor.www.twa&hl=en_IN&pli=1";
            }}
          >
            <i className="pi pi-calendar-plus"></i>
            <span>Ayum Doctor</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              background:
                "linear-gradient(120deg,var(--teal-600),var(--teal-900))",
              padding: "1rem",
              marginBottom: "5px",

              borderRadius: "24px",
              cursor: "pointer",

              color: "white",
            }}
            onClick={() => {
              window.location.href =
                "https://play.google.com/store/apps/details?id=in.ayum.twa&hl=en";
            }}
          >
            <i className="pi pi-verified"></i>
            <span>Ayum app</span>
          </div> */}
          <div
            style={{
              display: "flex",
              gap: "5px",
              background: "var(--surface-100)",
              padding: "1rem",
              marginBottom: "5px",
              borderRadius: "24px",
              cursor: "pointer",
              zIndex: "400",
            }}
            onClick={() => {
              router.push("/About");
              setVisible(false);
            }}
          >
            <i className="pi pi-globe"></i>
            <span>About Us</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              background: "var(--surface-100)",
              padding: "1rem",
              borderRadius: "24px",
              cursor: "pointer",

              marginBottom: "5px",
            }}
            onClick={() => {
              router.push("/Contact");
              setVisible(false);
            }}
          >
            <i className="pi pi-face-smile"></i>
            <span>Contact Us</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              background: "var(--surface-100)",
              padding: "1rem",
              marginBottom: "5px",
              cursor: "pointer",
              borderRadius: "24px",
            }}
            onClick={() => {
              router.push("/termsconditions");
              setVisible(false);
            }}
          >
            <i className="pi pi-flag"></i>
            <span>Terms & Conditions</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              background: "var(--surface-100)",
              padding: "1rem",
              marginBottom: "5px",
              cursor: "pointer",
              borderRadius: "24px",
            }}
            onClick={() => {
              router.push("/lab/bookings");
              setVisible(false);
            }}
          >
            <i className="pi pi-headphones"></i>
            <span>
              Labs{" "}
              <span
                style={{
                  padding: "2px 4px",
                  marginLeft: "10px",
                  color: "var(--surface-100)",
                  background: "var(--surface-700)",
                  borderRadius: "4px",
                }}
              >
                Beta
              </span>
            </span>
          </div>
        </Sidebar>
      </nav>
    </>
  );
};

export default React.memo(Navbar);

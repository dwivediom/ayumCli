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
import { Toast } from "primereact/toast";
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
        style={{
          position: "absolute",
          left: "10px",
          top: "20px",
          zIndex: "1000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "teal",
        }}
      >
        <span className="pi pi-bars"></span>
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
    const Docdata = JSON.parse(localStorage.getItem("DocData"));
    if (Docdata) {
      setuserdata(Docdata);
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

  const itemsmenu = [
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
      icon: "pi pi-sign-out",
      command: () => {
        localStorage.setItem("locale", "hi");
        setlang("hi");
      },
    },
    {
      label: "English",
      icon: "pi pi-sign-out",
      command: () => {
        localStorage.setItem("locale", "en");
        setlang("en");
      },
    },
    {
      label: "Sign out",
      icon: "pi pi-sign-out",
      command: () => {
        console.log("Hii");
        localStorage.clear();
        router.push("/User/UserRegistrationPage");
      },
    },
    {
      label: "Export",
      icon: "pi pi-upload",
    },
  ];
  const end = (
    <div className="flex align-items-center gap-2">
      <Avatar
        onClick={(event) => menuLeft.current.toggle(event)}
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
      <Menu
        style={{ width: "fit-content" }}
        model={itemsmenu}
        popup
        ref={menuLeft}
        id="popup_menu_right"
      />
    </div>
  );
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Toast ref={toast} />
      <nav className={` fixed top-0 z-10 w-full  `} style={{ zIndex: "100" }}>
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
      </nav>
    </>
  );
};

export default React.memo(Navbar);

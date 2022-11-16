import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { bgSecColor, bgPriColor } from "./theam/theam";
import Link from "next/link";
import Router from "next/router";

const Navbar = () => {
  const [profile, setprofile] = useState(false);
  const [navitem, setnavitem] = useState(false);

  const clickprofile = () => {
    setprofile((profile) => !profile);
  };
  const clicknavitem = () => {
    setnavitem((navitem) => !navitem);
  };
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
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
                onClick={clicknavitem}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
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
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <svg
                  className="hidden h-6 w-6"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <Link href={"/"}>
                <div className="flex flex-shrink-0 items-center">
                  <span className="block h-10 mr-6  lg:hidden lg:m-0 lg:h-0 lg:w-0">
                    <Image
                      style={{ marginTop: "-10px" }}
                      width={"100px"}
                      height={"40px"}
                      src={`/ayumTranparent.png`}
                      loading="eager"
                      alt="Your Company"
                    />
                  </span>
                  <span className="hidden h-8 w-auto lg:block">
                    <Image
                      width={"100px"}
                      height={"40px"}
                      src={`/ayumTranparent.png`}
                      alt="Your Company "
                      loading="eager"
                    />
                  </span>
                </div>
              </Link>
              <div className=" hidden sm:ml-10 md:block sm:block">
                <div>
                  <a
                    onClick={() => Router.push("/Contact/Contactpage")}
                    style={{
                      border: "1px solid rgba(39, 239, 245, 0.3)",
                      cursor: "pointer",
                    }}
                    className=" text-white px-2 py-1 rounded-md text-sm font-medium"
                    aria-current="page"
                  >
                    Contact Us
                  </a>
                </div>
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
              <div className="  space-y-1 px-2 pt-2 pb-3">
                <a
                  className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                  aria-current="page"
                  onClick={() => Router.push("/Contact/Contactpage")}
                >
                  Contact Us
                </a>
              </div>
              <div className="  space-y-1 px-2 pt-2 pb-3">
                <a
                  className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                  aria-current="page"
                  onClick={() => Router.push("/About/Aboutpage")}
                >
                  About Us
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

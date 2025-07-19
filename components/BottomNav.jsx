import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/footer.module.css";
import { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { useRouter } from "next/router";

const navItems = [
  { href: "/", icon: "pi-home", label: "Home" },
  { href: "/DoctorDirectory", icon: "pi-search", label: "Search" },
  { href: "/medical/requests", icon: "pi-box", label: "My Orders" },
  { href: "/User/userAppo", icon: "pi-user", label: "Appointments" },
];

const BottomNav = () => {
  const { hidebottomnav, lang, adminmode, sethidebottomnav } =
    useContext(AccountContext);
  const router = useRouter();
  const activeIndex = navItems.findIndex(
    (item) => router.pathname === item.href
  );

  return (
    <>
      <style jsx>{`
        .bottom-nav-container {
          position: fixed;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border-radius: 32px;
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          width: 100vw;
          max-width: 480px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          z-index: 100;
        }
        .nav-items-wrapper {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        .fab {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%)
          background: #339966;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(51, 153, 102, 0.15);
          border: 4px solid #fff;
          z-index: 101;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 8px;
        }
        .fab .nav-icon {
          color: teal;
          font-size: 28px;
        }
        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #b0b0b0;
          position: relative;
          z-index: 102;
          padding: 8px 0;
          min-width: 48px;
        }
        .nav-item .nav-icon {
          font-size: 24px;
          transition: color 0.2s;
        }
        .nav-item.active .nav-icon {
          // color: transparent;
        }
        .nav-item:hover {
          color: #339966;
        }
      `}</style>
      <div style={{ display: hidebottomnav ? "none" : "block" }}>
        <div className="bottom-nav-container">
          <div className="nav-items-wrapper">
            {/* Floating Action Button (FAB) that moves to active nav */}
            {/* <div
              className="fab"
              style={
                {
                  // transform: `translateY(-50%) translateX(calc((100% / ${navItems.length}) * ${activeIndex} + (100% / ${navItems.length} / 2) - 50%))`,
                }
              }
            >
              <div
                className={`nav-icon pi ${navItems[activeIndex]?.icon}`}
              ></div>
            </div> */}
            {/* Nav items */}
            {navItems.map((item, idx) => (
              <Link href={item.href} key={item.href}>
                <div
                  style={{
                    backgroundColor:
                      router.pathname === item.href ? "teal" : "transparent",
                    borderRadius: "50%",
                    width: "45px",
                    transform:
                      router.pathname === item.href
                        ? "translateY(-10px)"
                        : "translateY(0px)",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    zIndex: "102",

                    justifyContent: "center",
                    color: router.pathname === item.href ? "white" : "teal",
                  }}
                  // className={`nav-item${
                  //   router.pathname === item.href ? " active" : ""
                  // }`}
                >
                  <div
                    style={{
                      fontSize: "24px",
                    }}
                    className={`nav-icon pi ${item.icon}`}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;

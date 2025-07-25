import React, { useContext } from "react";
import Link from "next/link";
import styles from "../styles/footer.module.css";
import { AccountContext } from "../context/AccountProvider";
import { useRouter } from "next/router";

const navItems = [
  { href: "/", icon: "pi-home", label: "Home" },
  { href: "/DoctorDirectory", icon: "pi-search", label: "Search" },

  {
    href: "/lab/bookings",
    icon: (
      <img
        src={"/labreport.png"}
        alt="Lab Reports"
        style={{ width: 32, height: 32, objectFit: "contain" }}
      />
    ),
    label: "Reports",
  },
  { href: "/medical/requests", icon: "pi-box", label: "Orders" },
  { href: "/profile", icon: "pi-user", label: "Profile" },
];

const BottomNav = () => {
  const { hidebottomnav2 } = useContext(AccountContext);
  const router = useRouter();

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
        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          color: #b0b0b0;
          position: relative;
          z-index: 102;
          padding: 0;
          min-width: 48px;
          cursor: pointer;
          transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: transparent;
          color: teal;
          transition: background 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-item.active .nav-icon-wrapper {
          background: teal;
          color: #fff;
          transform: translateY(-8px) scale(1.08);
        }
        .nav-item .nav-icon {
          font-size: 24px;
          transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-label {
          font-size: 14px;
          margin-top: 2px;
          color: #888;
          opacity: 0;
          height: 0;
          transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
        }
        .nav-item.active .nav-label {
          opacity: 1;
          height: 14px;
          color: teal;
          margin-bottom: 15px;
        }
      `}</style>
      <div style={{ display: hidebottomnav2 ? "none" : "block" }}>
        <div className="bottom-nav-container">
          <div className="nav-items-wrapper">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              // Special handling for Lab Reports icon
              if (item.href === "/lab/bookings") {
                return (
                  <Link href={item.href} key={item.href}>
                    <div className={`nav-item${isActive ? " active" : ""}`}>
                      <div className="nav-icon-wrapper">
                        <img
                          src={
                            isActive ? "/labreportwhite.png" : "/labreport.png"
                          }
                          alt="Lab Reports"
                          style={{
                            width: 32,
                            height: 32,
                            objectFit: "contain",
                            transition:
                              "filter 0.35s cubic-bezier(0.4,0,0.2,1)",
                          }}
                        />
                      </div>
                      <div className="nav-label">{item.label}</div>
                    </div>
                  </Link>
                );
              }
              // Default rendering for other items
              return (
                <Link href={item.href} key={item.href}>
                  <div className={`nav-item${isActive ? " active" : ""}`}>
                    <div className="nav-icon-wrapper">
                      {typeof item.icon === "string" ? (
                        <div className={`nav-icon pi ${item.icon}`}></div>
                      ) : (
                        item.icon
                      )}
                    </div>
                    <div className="nav-label">{item.label}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;

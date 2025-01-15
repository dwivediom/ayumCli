import React from "react";
import Link from "next/link";
import styles from "../styles/footer.module.css";
import { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";

const BottomNav = () => {
  const { msgopened, scrollbox, lang, adminmode } = useContext(AccountContext);
  return (
    <>
      <div
        // className=" w-full  "
        style={{
          display: msgopened && "none",
          width: "100vw",
        }}
      >
        {/* <!-- <section id="bottom-navigation" className="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow"> // if shown only tablet/mobile--> */}
        <section
          style={{
            zIndex: 22,
            background: "white",
            boxShadow: "0 -3px 8px rgba(0,0,0,0.1)",
            borderTopLeftRadius: "32px",
            borderTopRightRadius: "32px",
            width: "100%",
            display: "block",
            position: "fixed",
            bottom: "0",
            zIndex: "100",
            left: "0",
          }}
          id="bottom-navigation"
          // className=" gird grid-cols-5   block fixed  inset-x-0 bottom-0 z-10  shadow"
        >
          {/* {scrollbox && (
            <div className={styles.scrollanimation}>
              <img
                src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/FFFFFF/external-Down-arrows-tanah-basah-glyph-tanah-basah-5.png"
                alt="down"
              />
            </div>
          )} */}
          <div
            style={{
              color: "teal",
              display: "flex",
              justifyContent: "space-evenly",
              // gap: "1rem",
            }}
          >
            <Link href={"/"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",

                  width: "100%",
                }}
              >
                <div style={{ fontSize: "22px" }} className="pi pi-home"></div>
                <span style={{ fontSize: "14px" }}>Home</span>
              </div>
            </Link>
            {adminmode && (
              <Link href={"/ChatSection"}>
                <a
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "3px",
                  }}
                >
                  <img
                    style={{ width: "25px", height: "25px" }}
                    alt="Lab Test"
                    src="https://img.icons8.com/external-vectorslab-glyph-vectorslab/53/FFFFFF/external-Injection-medical-and-corona-virus-vectorslab-glyph-vectorslab.png"
                  />

                  <span className="tab tab-whishlist  block text-xs">
                    {lang == "en" ? English.labtest : Hindi.labtest}
                  </span>
                </a>
              </Link>
            )}

            <Link href={"/DoctorDirectory"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  width: "100%",
                }}
              >
                <div
                  style={{ fontSize: "22px" }}
                  className="pi pi-search"
                ></div>
                <span style={{ fontSize: "14px" }}>Search</span>
              </div>
            </Link>

            <Link href={"/Category/Category"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",

                  width: "100%",
                }}
              >
                <div
                  style={{ fontSize: "22px" }}
                  className="pi pi-objects-column"
                ></div>
                <span style={{ fontSize: "14px" }}>Category</span>
              </div>
            </Link>

            <Link href={"/User/userAppo"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",

                  width: "100%",
                }}
              >
                <div style={{ fontSize: "22px" }} className="pi pi-user"></div>
                <span style={{ fontSize: "14px" }}>Appointments</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default BottomNav;

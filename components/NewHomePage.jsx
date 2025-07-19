import React, { useContext, useEffect, useState } from "react";
import SearchBox from "./Carousel/Search/SearchBox";
import styles from "../styles/Home.module.css";
import styles2 from "../styles/booktest.module.css";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import QuickSearch from "./QuickSearch";
import Carousel2 from "./Carousel2";
import HorizontalScroll from "./DemoAd";
import { getDoc, getOnboardedDoc, showMore } from "../routes/directory";
import DirectoryCard from "./DirectoryCard";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";
// import { Dialog, Modal } from "@mui/material";
// import TextField from "@mui/material/TextField";
import EmblaCarousel from "./Carousel/EmblaCarouselComp";
import CityDropdown from "./CityDropdown";
import LanguageModal from "./LanguageModal";
import DoctorCard from "./DoctorCard";
import { useRouter } from "next/router";
import { FaSearch, FaPills, FaVial } from "react-icons/fa";
import Typewriter from "./TypeWriteAnimate";

const categories = [
  { label: "Kidney" },
  { label: "Dentist" },
  { label: "Skin" },
  { label: "Heart" },
  { label: "Gynae" },
  // { label: "Brain" },
  { label: "Liver" },
  { label: "Kidney" },
  { label: "More", icon: "+" },
  // { label: "Stomach" },
];

const HeroSection = () => {
  const router = useRouter();
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "1rem",
        maxWidth: 420,
        width: "100%",
        marginLeft: "-2px",
        // margin: "1rem auto 0 auto",
        // margin: "auto",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(188, 246, 253, 0.81)",
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        <Typewriter text="Hello. How can we care for you today?" />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            color: "#666",
            fontWeight: 500,
          }}
        >
          <i className="pi pi-map-marker"></i>Rewa
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f8f9fa",
          borderRadius: "10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          padding: "1rem 0.8rem",
          marginBottom: "1rem",
          marginTop: "1rem",
          border: "1px solid #e9ecef",
        }}
      >
        <FaSearch color="#6c757d" size={16} />
        <input
          type="text"
          placeholder="Search doctors, clinics, or specialties..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            marginLeft: "0.5rem",
            fontSize: "0.98rem",
            flex: 1,
            padding: "0.3rem 0",
            color: "#333",
          }}
        />
      </div>

      {/* Specialist Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(90deg, #f8f9fa 60%, #fff 100%)",
          borderRadius: "12px",
          padding: "1.8rem 1.2rem",
          marginBottom: "1rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          border: "1px solid #e9ecef",
          height: "175px",
          backgroundImage: "url('/labbanner4.jpeg')",
          backgroundSize: "cover", // Keeps full image visible
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* <div
            style={{
              fontWeight: 700,
              fontSize: "1.02rem",
              color: "#008080",
              marginBottom: 2,
            }}
          >
            Need a skin specialist?
          </div>
          <div style={{ color: "#6c757d", fontSize: "0.93rem" }}>
            Let us help.
          </div> */}
        </div>
        {/* <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Doctor"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            objectFit: "cover",
            marginLeft: "0.7rem",
            border: "2px solid #fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        /> */}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginTop: "0.2rem",
        }}
      >
        <button
          style={{
            flex: 1,
            background: "#008080",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "1.5rem 0.5",
            fontWeight: 600,
            fontSize: "1.1rem",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            boxShadow: "0 2px 8px rgba(0,128,128,0.25)",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
          onClick={() => {
            router.push("/medical/list");
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#006666";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,128,128,0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#008080";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(0,128,128,0.25)";
          }}
        >
          <FaPills
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
          />{" "}
          Order Medicines
        </button>
        <button
          style={{
            flex: 1,
            background: "linear-gradient(90deg, #20d4a9 60%, #14b8a6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "1.5rem 0.5",
            fontWeight: 600,
            fontSize: "1.1rem",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            boxShadow: "0 2px 8px rgba(32,212,169,0.25)",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
          onClick={() => {
            router.push("/lab");
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(90deg, #1ba085 60%, #0f9b8a 100%)";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(32,212,169,0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(90deg, #20d4a9 60%, #14b8a6 100%)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(32,212,169,0.25)";
          }}
        >
          <FaVial
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
          />{" "}
          <span>Book Lab Tests</span>
        </button>
      </div>

      {/* Category Pills */}
    </div>
  );
};

const NewHomePage = () => {
  let [isMobile, setIsMobile] = useState(false);
  const [loading, setloading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Skin");

  const { admindialog, setadmindialog, setadminmode, langmodal } =
    useContext(AccountContext);
  const [showload, setshowload] = useState();
  const [full, setfull] = useState(false);
  const [docs, setdocs] = useState([]);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);
  const [onboardeddocs, setonboardeddocs] = useState([]);
  async function getalldoc() {
    setloading(true);
    const gotdata = await getDoc(localStorage.getItem("city"), "home");
    setdocs(gotdata.data);
    const onboarddoc = await getOnboardedDoc();
    console.log("onboarddocmapvalue");
    setonboardeddocs(onboarddoc?.data);
    setloading(false);
  }
  useEffect(() => {
    if (!langmodal) {
      getalldoc();
    }
  }, [langmodal]);
  const ShowMoreDoc = async () => {
    setshowload(true);
    const data = await showMore();
    if (data?.data?.length == 0) {
      setfull(true);
    }
    setdocs(docs.concat(data.data));
    console.log(docs);
    setshowload(false);
  };
  const slidesData = [
    {
      id: 1,
      imageSrc: "https://i.ibb.co/ZXcC6Gp/Ayum-6.png",
      title: "Slide 1",
    },
    {
      id: 2,
      imageSrc: "https://i.ibb.co/R4xmXHw/Ayum-7.png",
      title: "Slide 2",
    },
    {
      id: 3,
      imageSrc: "https://i.ibb.co/5MKMQt7/Ayum-1.png",
      title: "Slide 3",
    },
    {
      id: 4,
      imageSrc: "https://i.ibb.co/HndrXXQ/Ayum-2.png",
      title: "Slide 4",
    },
    {
      id: 5,
      imageSrc: "https://i.ibb.co/WpW5vS6/Ayum-4.png",
      title: "Slide 5",
    },
    {
      id: 6,
      imageSrc: "https://i.ibb.co/XSh3b0d/Ayum.png",
      title: "Slide 6",
    },
    // {
    //   id: 7,
    //   imageSrc: "/contact2.jpg",
    //   title: "Slide 7",
    // },
    // {
    //   id: 8,
    //   imageSrc: "/contact2.jpg",
    //   title: "Slide 8",
    // },
    // {
    //   id: 9,
    //   imageSrc: "/contact2.jpg",
    //   title: "Slide 9",
    // },
  ];
  const [phoneNumber, setPhoneNumber] = useState("+919425681022");
  const [message, setMessage] = useState("");
  const [searcheddoctor, setsearcheddoctor] = useState("");
  const [errorMessage, setErrorMessage] = useState("Error Occured");

  const handleClick = () => {
    // Basic validation to ensure required fields are filled
    if (!phoneNumber) {
      console.log("errorhe");
      setErrorMessage("Please enter both phone number and message.");
      return;
    }

    // Format phone number (remove non-numeric characters and prepend country code if needed)
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    const whatsappNumber = `+${formattedNumber}`; // Replace with your country code if necessary

    // Encode message for URL inclusion
    const encodedMessage = encodeURI(
      `Hii Team Ayum, Please add information about Dr. ${searcheddoctor} as soon as possible.`
    );

    // Construct WhatsApp Web URL
    const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    try {
      // Open the URL in a new tab/window
      window.open(url, "_blank");
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error opening WhatsApp Web:", error);
    }
  };

  const { lang } = useContext(AccountContext);
  const router = useRouter();
  return (
    <div className={styles.mainshell}>
      {langmodal && <LanguageModal getdocs={getalldoc} />}

      {/* New Design Code Starts */}
      <HeroSection />
      {/* New Design Code Ends */}

      {/* <SearchBox
        setsearcheddoctor={setsearcheddoctor}
        setdoctordocs={(data) => {
          console.log(data, "dataofdocs");
          setdocs(data?.data);
        }}
      /> */}
      {/* <QuickSearch />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "5px",
          background: "#008080",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          marginTop: "10px",
          position: "relative",
        }}
        onClick={() => {
          router.push("/medical");
        }}
      >
        <img
          src="/deliveryicon.png"
          alt="deliveryicon"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "10px",
            position: "absolute",
            left: "10px",
          }}
        />{" "}
        {lang == "en" ? English.ordermedicine : Hindi.ordermedicine}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "5px",
          background: "#008080",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          marginTop: "10px",
          position: "relative",
        }}
        onClick={() => {
          router.push("/medical");
        }}
      >
        <img
          src="/whitetesttube.png"
          alt="deliveryicon"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "10px",
            position: "absolute",
            left: "10px",
          }}
        />{" "}
        {lang == "en" ? English.booklabtest : Hindi.booklabtest}
      </div> */}
      {/* 
      {isMobile ? (
        <EmblaCarousel slidesData={slidesData} page={"home"} />
      ) : (
        <HorizontalScroll />
      )}

      <CityDropdown getdocs={getalldoc} /> */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: isMobile ? "1rem" : "2rem",
          marginTop: "0.5rem",
        }}
      >
        {loading ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Image
              src={"/loader.svg"}
              width={40}
              height={40}
              alt={"Loader Img"}
            />
          </div>
        ) : (
          !docs?.length && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    marginTop: "10px",
                    borderRadius: "36px",
                  }}
                  className={`${styles2.submitbtn} shadow-lg`}
                  onClick={() => handleClick()}
                >
                  Request to Add this Doctor
                </div>
              </div>
            </>
          )
        )}
        {loading ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Image
              src={"/loader.svg"}
              width={40}
              height={40}
              alt={"Loader Img"}
            />
          </div>
        ) : docs?.length > 0 || onboardeddocs?.length > 0 ? (
          <>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                marginTop: "1.5rem",
                marginBottom: "-1rem",
              }}
            >
              Find Doctors In{" "}
              <span style={{ color: "#008080", fontWeight: "700" }}>
                {localStorage.getItem("city")}
              </span>
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                marginTop: "1rem",
                marginBottom: "-1rem",
                flexWrap: "wrap",
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "0.5rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                border: "1px solid #e9ecef",
                marginLeft: "-5px",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background:
                      activeCategory === cat.label ? "#e6fffa" : "#f8f9fa",
                    color: activeCategory === cat.label ? "#008080" : "#495057",
                    border:
                      activeCategory === cat.label
                        ? "1px solid #b2f5ea"
                        : "1px solid #e9ecef",
                    borderRadius: "999px",
                    padding: "0.32rem 1rem",
                    fontWeight: 500,
                    fontSize: "0.98rem",
                    cursor: "pointer",
                    boxShadow:
                      activeCategory === cat.label
                        ? "0 1px 4px rgba(0,128,128,0.15)"
                        : "none",
                    transition: "all 0.18s",
                    minWidth: 0,
                  }}
                >
                  {cat.icon && (
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#fff",
                        color: "#008080",
                        fontWeight: 700,
                        marginRight: 5,
                        border: "1.2px solid #008080",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                      }}
                    >
                      {cat.icon}
                    </span>
                  )}
                  {cat.label}
                </button>
              ))}
            </div>
            {docs.length > 0 &&
              docs.map((item) => {
                return <DirectoryCard key={item._id} item={item && item} />;
              })}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                paddingBottom: "2rem",
              }}
            >
              {onboardeddocs?.length > 0 &&
                onboardeddocs?.map((item) => {
                  return (
                    <DoctorCard
                      key={item._id}
                      pic={item.picture && item.picture}
                      name={item && item.name}
                      specialist={item.specialist && item.specialist}
                      location={item.location && item.location}
                      phone={item && item.phone}
                      fees={item.fees && item.fees}
                      timing={item.timing && item.timing}
                      docid={item._id && item._id}
                    />
                  );
                })}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="pb-20 ">
        {full ? (
          <div
            // onClick={() => ShowMoreDoc()}
            className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
          >
            Thats It
          </div>
        ) : (
          <div
            onClick={() => ShowMoreDoc()}
            className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
          >
            {showload ? "Loading..." : "Show More"}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewHomePage;

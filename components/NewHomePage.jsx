import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import styles2 from "../styles/booktest.module.css";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { getDoc, getOnboardedDoc, showMore } from "../routes/directory";
import DirectoryCard from "./DirectoryCard";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";
// import { Dialog, Modal } from "@mui/material";
// import TextField from "@mui/material/TextField";
import LanguageModal from "./LanguageModal";
import DoctorCard from "./DoctorCard";
import { useRouter } from "next/router";
import { FaSearch, FaPills, FaVial } from "react-icons/fa";
import Typewriter from "./TypeWriteAnimate";
import HeroSection from "./HeroSection";
import { cityoptions } from "../public/utils/Utils";
const categories = [
  { label: "Kidney" },
  { label: "Dentist" },
  { label: "Skin" },
  { label: "Heart" },
  { label: "Gynae" },
  // { label: "Brain" },
  { label: "Liver" },
  { label: "Stomach" },
  { label: "More", icon: "+" },
];

const NewHomePage = () => {
  let [isMobile, setIsMobile] = useState(false);
  const [loading, setloading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Skin");
  const [city, setCity] = useState();

  const { langmodal, sethidebottomnav2 } = useContext(AccountContext);
  const [showload, setshowload] = useState();
  const [full, setfull] = useState(false);
  const [docs, setdocs] = useState([]);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    sethidebottomnav2(false);
    setIsMobile(mobile.matches);
    setCity(
      window && localStorage.getItem("city")
        ? localStorage.getItem("city")
        : "Rewa"
    );
  }, []);
  const [onboardeddocs, setonboardeddocs] = useState([]);
  async function getalldoc() {
    setloading(true);
    const gotdata = await getDoc(
      city,
      "home",
      activeCategory === "More" ? "" : activeCategory
    );
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
  }, [langmodal, activeCategory]);

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

  return (
    <div className={styles.mainshell}>
      {langmodal && <LanguageModal getdocs={getalldoc} />}

      {/* New Design Code Starts */}
      <HeroSection city={city} setCity={setCity} />
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
          <></>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
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
                  justifyContent: "center",
                  alignItems: "center",
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
                      color:
                        activeCategory === cat.label ? "#008080" : "#495057",
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
            </div>
            {docs?.length > 0 &&
              docs?.map((item) => {
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
                activeCategory === "More" &&
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
      {!docs?.length && activeCategory === "More" && (
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
      )}
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

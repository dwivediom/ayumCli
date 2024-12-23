import React, { useContext, useEffect, useState } from "react";
import SearchBox from "./Carousel/Search/SearchBox";
import styles from "../styles/Home.module.css";
import styles2 from "../styles/booktest.module.css";

import QuickSearch from "./QuickSearch";
import Carousel2 from "./Carousel2";
import HorizontalScroll from "./DemoAd";
import { getDoc, showMore } from "../routes/directory";
import DirectoryCard from "./DirectoryCard";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";
// import { Dialog, Modal } from "@mui/material";
// import TextField from "@mui/material/TextField";
import EmblaCarousel from "./Carousel/EmblaCarouselComp";
import CityDropdown from "./CityDropdown";
import LanguageModal from "./LanguageModal";

const NewHomePage = () => {
  let [isMobile, setIsMobile] = useState(false);
  const [loading, setloading] = useState(false);
  const { admindialog, setadmindialog, setadminmode, langmodal } =
    useContext(AccountContext);
  const [showload, setshowload] = useState();
  const [full, setfull] = useState(false);
  const [docs, setdocs] = useState([]);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);
  async function getalldoc() {
    setloading(true);
    const gotdata = await getDoc(localStorage.getItem("city"));
    setdocs(gotdata.data);
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
  const handleClick = () => {
    // Basic validation to ensure required fields are filled
    if (!phoneNumber || !message) {
      setErrorMessage("Please enter both phone number and message.");
      return;
    }

    // Format phone number (remove non-numeric characters and prepend country code if needed)
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    const whatsappNumber = `+${formattedNumber}`; // Replace with your country code if necessary

    // Encode message for URL inclusion
    const encodedMessage = encodeURI(message);

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
      <SearchBox
        setdoctordocs={(data) => {
          console.log(data, "dataofdocs");
          setdocs(data?.data);
        }}
      />
      <QuickSearch />
      {isMobile ? (
        <EmblaCarousel slidesData={slidesData} page={"home"} />
      ) : (
        <HorizontalScroll />
      )}
      <CityDropdown getdocs={getalldoc} />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
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
        ) : docs?.length > 0 ? (
          docs.map((item) => {
            return <DirectoryCard key={item._id} item={item && item} />;
          })
        ) : (
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

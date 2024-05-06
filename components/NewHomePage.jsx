import React, { useContext, useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import styles from "../styles/Home.module.css";
import QuickSearch from "./QuickSearch";
import Carousel2 from "./Carousel2";
import HorizontalScroll from "./DemoAd";
import { getDoc, showMore } from "../routes/directory";
import DirectoryCard from "./DirectoryCard";
import Image from "next/image";
import { AccountContext } from "../context/AccountProvider";
import { Dialog, Modal } from "@mui/material";
import EmblaCarousel from "./Carousel/Emblacarousel";

const NewHomePage = () => {
  let [isMobile, setIsMobile] = useState(false);
  const [loading, setloading] = useState(false);
  const { admindialog, setadmindialog, setadminmode } =
    useContext(AccountContext);
  const [showload, setshowload] = useState();
  const [full, setfull] = useState(false);
  const [docs, setdocs] = useState([]);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);
  useEffect(() => {
    async function getalldoc() {
      setloading(true);
      const gotdata = await getDoc();
      console.log(gotdata);
      setdocs(gotdata.data);
      console.log(docs && docs, "All dOcs Data");
      setloading(false);
    }
    getalldoc();
  }, []);
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

  return (
    <div className={styles.mainshell}>
      {/* <Dialog
        open={admindialog}
        onClose={() => {
          setadmindialog(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={{ padding: "2rem" }}>
          <input
            className="rounded-full p-1"
            style={{ padding: "6px" }}
            value={code}
            onChange={(e) => setcode(e.target.value)}
            placeholder="Enter Code"
          />{" "}
          <button
            className="bg-cyan-900 p-2 text-cyan-100 rounded-full"
            onClick={() => {
              if (code == "ayum@321one") {
                setadminmode(true);
                setadmindialog(false);
              }
            }}
          >
            Submit
          </button>
        </div>
      </Dialog>{" "} */}
      <SearchBox />
      <QuickSearch />
      {isMobile ? (
        <EmblaCarousel slidesData={slidesData} />
      ) : (
        <HorizontalScroll />
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "2rem",
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
          docs?.length > 0 &&
          docs.map((item) => {
            return <DirectoryCard key={item._id} item={item && item} />;
          })
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

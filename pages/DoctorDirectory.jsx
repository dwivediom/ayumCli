import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import DirectoryCard from "../components/DirectoryCard";
import { directorydata } from "../routes/data";
import { getDoc, SearchDoc, showMore } from "../routes/directory";
import styles from "../styles/Phonebook.module.css";
import styles1 from "../styles/Searchinput.module.css";

import Slider2 from "../components/AdComp3";
import { AccountContext } from "../context/AccountProvider";
import { useRouter } from "next/router";
import EmblaCarousel from "../components/Carousel/EmblaCarouselComp";
import HorizontalScroll from "../components/DemoAd";

const DoctorDirectory = () => {
  const [showload, setshowload] = useState();
  const [loading, setloading] = useState(false);
  const [full, setfull] = useState(false);
  const [input, setinput] = useState({
    val: "",
  });
  const slidesData = [
    {
      id: 6,
      imageSrc: "https://i.ibb.co/gDQXxJP/Ayum.jpg",
      title: "Slide 5",
    },
    {
      id: 7,
      imageSrc: "https://i.ibb.co/r5HHcx0/Ayum-2.jpg",
      title: "Slide 7",
    },

    {
      id: 2,
      imageSrc: "https://i.ibb.co/f22BMwT/Ayum-3.jpg",
      title: "Slide 2",
    },
    {
      id: 3,
      imageSrc: "https://i.ibb.co/HndrXXQ/Ayum-2.png",
      title: "Slide 3",
    },
    {
      id: 4,
      imageSrc: "https://i.ibb.co/WpW5vS6/Ayum-4.png",
      title: "Slide 4",
    },
    {
      id: 5,
      imageSrc: "https://i.ibb.co/XSh3b0d/Ayum.png",
      title: "Slide 4",
    },
  ];
  const router = useRouter();
  const { docid } = router.query;
  const { setscrollbox } = useContext(AccountContext);

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

  const handleChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
    console.log(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.val == "") {
      const gotdata = await getDoc();

      return setdocs(gotdata.data);
    }
    const getdata = await SearchDoc(input.val);
    console.log(getdata);
    setdocs(getdata.data);
  };

  useEffect(() => {
    let indexbox = document.getElementById("directorypage");
    // console.log(indexbox.scrollTop);
    indexbox.addEventListener("scroll", () => {
      let scrollTop = indexbox.scrollTop;
      if (scrollTop > 0) {
        setscrollbox(false);
      } else {
        setscrollbox(true);
      }
    });
  }, []);

  const [docs, setdocs] = useState();
  const [pageNum, setPageNum] = useState(1);

  const fetchMoreDocs = async () => {
    const nextPageNum = pageNum + 1;
    const response = await fetch(
      process.env.NEXT_PUBLIC_B_PORT +
        "/api/docdirectory/page?pageNum=" +
        nextPageNum
    );
    const newData = await response.json();
    setdocs([...docs, ...newData]);
    setPageNum(nextPageNum);
  };
  let [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);
  return (
    <>
      <div
        id="directorypage"
        className={`${styles.directorypage} h-[100vh] overflow-auto p-5`}
      >
        <form
          onSubmit={(e) => handleSubmit(e)}
          className={`${styles1.searchform}`}
          action="#"
        >
          <div className="relative">
            <input
              type="search"
              id="search"
              name="val"
              className={`${styles1.searchinput}`}
              placeholder="Search Doctor..."
              onChange={(e) => handleChange(e)}
            />
            <button
              onClick={(e) => handleSubmit(e)}
              type="button"
              className={`${styles1.searchbtn}`}
            >
              Search
            </button>
          </div>
        </form>
        <div
          style={{
            paddingTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // marginRight: "2rem",
          }}
        >
          {isMobile ? (
            <EmblaCarousel page={"home"} />
          ) : (
            <HorizontalScroll page={"home"} />
          )}
        </div>
        <div className={`${styles.directoryshell}`}>
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
              return (
                <DirectoryCard
                  key={item._id}
                  item={item && item}
                  docid={router.query?.docid}
                />
              );
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
              onClick={() => fetchMoreDocs()}
              className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
            >
              {showload ? "Loading..." : "Show More"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDirectory;

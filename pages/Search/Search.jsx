import React from "react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "../../styles/Searchinput.module.css";
import styles2 from "../../styles/doctorcard.module.css";
import DoctorCard from "../../components/DoctorCard";
import Image from "next/image";
import { setDocDataAction } from "../../redux/actions/userActions";
import { SearchDoc } from "../../routes/directory";
import DirectoryCard from "../../components/DirectoryCard";
import English from "../../public/locales/en/search";
import Hindi from "../../public/locales/hi/search";
import Slider2 from "../../components/AdComp3";
import { useContext } from "react";
import ReactGA from "react-ga4";
import { AccountContext } from "../../context/AccountProvider";
import Router, { useRouter } from "next/router";
import HorizontalScroll from "../../components/DemoAd";
import EmblaCarousel from "../../components/Carousel/EmblaCarouselComp";

const Search = () => {
  const [data, setdata] = useState(null);
  const [docs, setdocs] = useState([]);

  const [input, setinput] = useState("");
  const sdata = useSelector((state) => state.quickSearchReducer);
  const [loading, setloading] = useState(false);
  const [reload, setreload] = useState(true);
  const [viewsearchill, setviewsearchill] = useState(true);
  const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/search/${input}`;
  const router = useRouter();
  // useEffect(() => {
  //   if (router.query.type && input == "") {
  //     onloadSearch(router.query.type);
  //   }
  // }, [sdata, reload]);

  const onloadSearch = async (input) => {
    setloading(true);
    const newurl = `${process.env.NEXT_PUBLIC_B_PORT}/api/search/${input}`;
    const searchdata = await axios.get(newurl);
    console.log(searchdata, "searchdata");
    setdocs(searchdata?.data);
    setloading(false);
    setreload(false);
    if (searchdata) {
      setviewsearchill(false);
    }
    localStorage.removeItem("skey");
  };

  const onSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setviewsearchill(false);
    setloading(true);
    setreload(false);
    if (e) {
      e.preventDefault();
    }
    const searchdata = await axios.get(url);
    ReactGA.event({
      category: "Search Box Input",
      action: "searched",
      label: input,
      value: input,
    });
    // const getdata = await SearchDoc(input);
    // setdocs(getdata.data);
    // setdata(searchdata);
    setdocs([...searchdata?.data, ...docs]);
    setloading(false);
  };
  {
    data && console.log(data.data);
  }

  const handleChange = (e) => {
    let val = e.target.value;
    setinput(val);
  };

  let [isMobile, setIsMobile] = useState(false);

  const { setscrollbox, lang } = useContext(AccountContext);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
    // if (router.query.type) {
    // }
    let indexbox = document.getElementById("searchpage");
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

  useEffect(() => {
    if (!router.query.type) {
      return;
    }
    onloadSearch(router.query.type);
  }, [router.query.type]);
  return (
    <>
      <div
        id="searchpage"
        className={`p-4  w-[98vw] h-[100vh] overflow-x-hidden overflow-y-scroll pb-[8rem] ${styles.searchpage}`}
      >
        <form className={`${styles.searchform}`} onSubmit={(e) => onSearch(e)}>
          <div className="relative">
            <input
              type="search"
              onChange={(e) => handleChange(e)}
              id="default-search"
              className={`${styles.searchinput}`}
              placeholder={
                lang == "en" ? English.placeholder : Hindi.placeholder
              }
            />
            <button
              type="button"
              onClick={(e) => onSearch(e)}
              className={`${styles.searchbtn}`}
            >
              {lang == "en" ? English.search : Hindi.search}
            </button>
          </div>
        </form>
        {isMobile ? (
          <EmblaCarousel page={"home"} />
        ) : (
          <HorizontalScroll page={"home"} />
        )}
        {loading ? (
          <div
            style={{
              width: "100vw",
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              marginTop: "1rem",
            }}
          >
            <Image
              src={"/loader.svg"}
              width={40}
              height={40}
              alt="Loading..."
            />
          </div>
        ) : (
          <div className={`${styles2.doccontainer} `}>
            {docs && docs.length == 0 ? (
              <div
                style={{
                  height: "50vh",
                  width: "90vw",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <Image
                  src={"/notfound.png"}
                  width={170}
                  height={140}
                  alt="Loading..."
                />
              </div>
            ) : (
              <>
                <div className="shadow-lg p-1 w-full text-center font-bold rounded-lg">
                  {lang == "en" ? English.searcdocinfo : Hindi.searcdocinfo}
                </div>
                <div className={`${styles2.directoryshell} `}>
                  {docs &&
                    docs.map((item) => {
                      return (
                        <DirectoryCard key={item._id} item={item && item} />
                      );
                    })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;

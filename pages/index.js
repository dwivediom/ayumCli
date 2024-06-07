import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import ThankyouCard from "../components/ThankyouCard";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountProvider";
import Modal from "../components/Modal";
import Docphonebookbtn from "../components/Docphonebookbtn";
import Nashmukti from "../components/Nashmuktibtn";
import BloodDonatebtn from "../components/BloodDonatebtn";
import ReactGA from "react-ga4";
import Router, { useRouter } from "next/router";
import HorizontalScroll from "../components/DemoAd";
const host = process.env.NEXT_PUBLIC_B_PORT;
const SearchBox = dynamic(() => import("../components/SearchBox"));
const QuickSearch = dynamic(() => import("../components/QuickSearch"));
const GetDoctor = dynamic(() => import("../components/GetDoctor"));
const Footer = dynamic(() => import("../components/Footer"));
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import LanguageModal from "../components/LanguageModal";
import Carousel2 from "../components/Carousel2";
// import { getCookie } from "./utils/Utils";
import ThankModal from "../components/Modal";
import { getCookie } from "../public/utils/Utils";
import NewHomePage from "../components/NewHomePage";
import EmblaCarousel from "../components/Carousel/EmblaCarouselComp";
// import Hindi from "/locales/hi/index";
export async function getServerSideProps(context) {
  try {
    let userToken;
    if (typeof window !== "undefined") {
      userToken = await getCookie("usertoken");
    }
    console.log("User Token:", userToken);

    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/profile`,
      {
        headers: {
          "x-auth-token": context.req.headers.cookie
            ? context.req.headers.cookie
            : false,
          // "x-auth-token": context.query.usertoken,
          home: true,
        },
      }
    );

    return {
      props: {
        data: data.data,
      },
    };
  } catch (error) {
    console.error(error, "erroror");
    if (error.response?.data.msg == "invalid") {
      return {
        props: {
          error: "invalid",
        },
      };
    } else {
      return {
        props: {
          error: "Unable to fetch data",
        },
      };
    }
  }
}
export default function Home(props) {
  const router = useRouter();
  useEffect(() => {
    async function firstcall() {
      if (props.error && props.error == "invalid") {
        localStorage.removeItem("usertoken");
        localStorage.removeItem("labuser");
        router.push("/User/UserRegistrationPage?session=expired");
        // window.location.href = "/User/UserRegistrationPage?type=newses";
      }
      const userToken = await getCookie("usertoken");
      console.log("usertoken", userToken);
      console.log("Rendering");
      let mobile = window && window.matchMedia("(max-width: 550px)");
      setIsMobile(mobile.matches);
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname + window.location.search,
        title: "Home Page",
      });
      const handleOnline = () => {
        setIsOnline(true);
        console.log("User is online");
      };
      const handleOffline = () => {
        setIsOnline(false);
        console.log("User is offline");
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      if (props.data) {
        setdoctors(props.data && props.data);
      } else {
        setdoctors(null);
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
    firstcall();
  }, []);
  const {
    thankmodal,
    setthankmodal,
    setscrollbox,
    setlang,
    lang,
    langmodal,
    adminmode,
  } = useContext(AccountContext);

  const [isOnline, setIsOnline] = useState(true);
  const [doctors, setdoctors] = useState([]);
  const [full, setfull] = useState(false);
  const [loading, setloading] = useState(false);

  // useEffect(() => {
  // console.log(props, "propdatah");

  // }, []);

  // useEffect(() => {
  //   const handleOnline = () => {
  //     setIsOnline(true);
  //     console.log("User is online");
  //   };
  //   const handleOffline = () => {
  //     setIsOnline(false);
  //     console.log("User is offline");
  //   };

  //   window.addEventListener("online", handleOnline);
  //   window.addEventListener("offline", handleOffline);

  //   return () => {
  //     window.removeEventListener("online", handleOnline);
  //     window.removeEventListener("offline", handleOffline);
  //   };
  // }, []);
  // useEffect(() => {
  // console.log(props.data, "data");
  // if (props.data) {
  //   setdoctors(props.data && props.data);
  // } else {
  //   setdoctors(null);
  // }

  //   if (localStorage.getItem("thankmodal") == true) {
  //     setthankmodal(true);
  //     setTimeout(() => {
  //       localStorage.setItem("thankmodal", false);
  //       setthankmodal(false);
  //     }, 2500);
  //     // setauthstatus(false);
  //   }
  // }, []);

  const Loadmore = async () => {
    setloading(true);
    const newdocdata = await axios({
      method: "get",
      url: `${host}/api/profile/showmoreDoc`,
    });
    console.log("Data aa rha hai", newdocdata);
    if (newdocdata.data.length === 0) {
      setfull(true);
    }

    const finalstatedata = doctors.concat(newdocdata.data);
    console.log(finalstatedata, "Final data hai");

    setdoctors(finalstatedata);
    setloading(false);
  };

  // Router.events.on("routeChangeStart", (url) => {
  //   setscrollbox(true);
  // });

  // useEffect(() => {
  //   let indexbox = document.getElementById("indexbox");
  //   // console.log(indexbox.scrollTop);
  //   indexbox.addEventListener("scroll", () => {
  //     let scrollTop = indexbox.scrollTop;
  //     if (scrollTop > 0) {
  //       setscrollbox(false);
  //     } else {
  //       setscrollbox(true);
  //     }
  //   });
  // }, []);

  // const handlelangchange = (lang) => {
  //   localStorage.setItem("locale", lang);
  //   setlang(lang);
  // };
  // if (!isOnline) {
  //   return (
  //     <>
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           height: "60vh",
  //           flexDirection: "column",
  //         }}
  //       >
  //         <Image
  //           width={200}
  //           height={200}
  //           src="/offline.png"
  //           alt="Offline animation"
  //         />
  //         <h2 style={{ fontWeight: "bold", color: "red" }}>
  //           {lang == "en" ? English.online : Hindi.online}
  //         </h2>
  //       </div>
  //     </>
  //   );
  // }

  let [isMobile, setIsMobile] = useState(false);
  // const [admin, setadmin] = useState(true);
  const adurl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/getuserads`;
  const GetAdsData = async () => {
    try {
      let userdata = await axios.get(adurl, {}, { home: true });
      console.log(userdata, "UserDAta");
    } catch (error) {
      console.log(error, "error");
    }
  };

  // useEffect(() => {
  //   GetAdsData();
  // });
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

  const OPTIONS = { loop: true, autoplay: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  return (
    <>
      <Head>
        <title>Ayum</title>
        <meta name="title" content="ayum" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta
          name="description"
          content="Ayum is Online Doctor Appointment Booking Platform and Health Care Services Provider i,e Lab Reports , Medicine Delivery etc.  "
        />
        <meta
          name="google-site-verification"
          content="TZ_t3W3EZ4x4C5q8BPlZ_luCjIeWczMJwCyObT8AjYA"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {langmodal && <LanguageModal />}
      {!adminmode ? (
        <NewHomePage />
      ) : (
        <div>
          <div className={styles.mainshell}>
            <SearchBox />
            <QuickSearch />
            <div className={styles.directorycontainer}>
              <Docphonebookbtn />
              <Nashmukti />
              <BloodDonatebtn />
            </div>
            {isMobile ? (
              <EmblaCarousel slidesData={slidesData} />
            ) : (
              <HorizontalScroll />
            )}

            {doctors ? (
              <main>
                {props.data ? (
                  <GetDoctor getDoctor={doctors} />
                ) : (
                  <div
                    style={{
                      width: "100vw",
                      height: "50vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={"/loader.svg"}
                      width={40}
                      height={40}
                      alt="Loading..."
                    />
                  </div>
                )}
              </main>
            ) : (
              <p className="text-center">
                {lang == "en" ? English.loading : Hindi.loading}
              </p>
            )}
          </div>
          {full ? (
            <div className="m-auto p-2 border border-gray-700 w-[14rem] text-center mt-9 text-cyan-600  font-bold  ">
              {lang == "en" ? English.thatsit : Hindi.thatsit}
            </div>
          ) : (
            <div
              onClick={() => !loading && Loadmore()}
              className="m-auto p-2 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer shadow-md "
            >
              {loading ? (
                <Image
                  src={"/loader.svg"}
                  width={40}
                  height={40}
                  alt="Loading..."
                />
              ) : (
                <span> {lang == "en" ? English.showmore : Hindi.showmore}</span>
              )}
            </div>
          )}
        </div>
      )}

      <Footer />
      {thankmodal && <ThankModal />}
    </>
  );
}

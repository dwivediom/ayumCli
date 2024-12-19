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
import Carousel2 from "../components/Carousel2";
import HorizontalScroll from "../components/DemoAd";
import Head from "next/head";
import EmblaCarouselComp from "../components/Carousel/EmblaCarouselComp";
import SearchBox from "../components/Carousel/Search/SearchBox";
import NewDocprofile from "../components/NewDocprofile";

const Doctors = ({ initialData }) => {
  const [showload, setshowload] = useState();
  const [loading, setloading] = useState(false);
  const [full, setfull] = useState(false);
  const [input, setinput] = useState({
    val: "",
  });
  const router = useRouter();
  const { docid } = router.query;
  // const { setscrollbox } = useContext(AccountContext);

  // useEffect(() => {
  //   async function getalldoc() {
  //     setloading(true);
  //     const gotdata = await getDoc();
  //     console.log(gotdata);
  //     setdocs(gotdata.data);
  //     console.log(docs && docs, "All dOcs Data");
  //     setloading(false);
  //   }
  //   getalldoc();
  // }, []);

  // const ShowMoreDoc = async () => {
  //   setshowload(true);
  //   const data = await showMore();
  //   if (data?.data?.length == 0) {
  //     setfull(true);
  //   }
  //   setdocs(docs.concat(data.data));
  //   console.log(docs);
  //   setshowload(false);
  // };

  // const handleChange = (e) => {
  //   setinput({ ...input, [e.target.name]: e.target.value });
  //   console.log(input);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (input.val == "") {
  //     const gotdata = await getDoc();

  //     return setdocs(gotdata.data);
  //   }
  //   const getdata = await SearchDoc(input.val);
  //   console.log(getdata);
  //   setdocs(getdata.data);
  // };

  // useEffect(() => {
  //   let indexbox = document.getElementById("directorypage");
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

  // const [profileData, setProfileData] = useState(initialProfileData);
  const [docs, setdocs] = useState(initialData);
  const [pageNum, setPageNum] = useState(1);

  const jsonLdMarkup = {
    "@context": "https://schema.org",
    "@type": "Best Doctors",
    itemListElement: initialData.map((doctor, index) => ({
      "@type": "Top Doctors",
      position: index + 1,
      item: {
        "@type": "Doctor",
        ...doctor,
      },
    })),
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
    console.log(initialData, "doctordata");
    setIsMobile(mobile.matches);
  }, []);
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMarkup) }}
        />
        <title>All Doctors</title>
      </Head>
      <div id="directorypage" className={`${styles.directorypage} `}>
        {/* <form
          onSubmit={(e) => {}}
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
              onChange={(e) => {}}
              onFocus={() => router.push("/DoctorDirectory")}
            />
            <button
              onClick={(e) => {}}
              type="button"
              className={`${styles1.searchbtn}`}
            >
              Search
            </button>
          </div>
        </form> */}
        <SearchBox
          setdoctordocs={(data) => {
            console.log(data, "dataofdocs");
            setdocs(data?.data);
          }}
          redirecttohome={true}
        />
        {/* <Slider2 /> */}
        {isMobile ? (
          <EmblaCarouselComp slidesData={slidesData} />
        ) : (
          <HorizontalScroll />
        )}
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
                <>
                  {router.query.docid && item.onAyum && item.doctorid ? (
                    <NewDocprofile
                      key={item._id}
                      item={item && item}
                      docid={item.doctorid}
                      isMobile={isMobile}
                    />
                  ) : (
                    <DirectoryCard
                      key={item._id}
                      item={item && item}
                      docid={router.query?.docid}
                      isMobile={isMobile}
                      showreview={router.query?.docid ? true : false}
                    />
                  )}
                </>
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
            !router.query.docid && (
              <div
                onClick={() => fetchMoreDocs()}
                className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
              >
                {showload ? "Loading..." : "Show More"}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Doctors;

export async function getServerSideProps({ query }) {
  // Fetch profile data on server-side
  const { docid, p } = query;
  const res = await fetch(
    process.env.NEXT_PUBLIC_B_PORT +
      `/api/docdirectory/page?pageNum=${p}&docid=${docid}`
  );
  const initialData = await res.json();

  return {
    props: {
      initialData,
    },
  };
}

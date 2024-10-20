import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import DirectoryCard from "../../components/DirectoryCard";
import { directorydata } from "../../routes/data";
import styles from "../../styles/Phonebook.module.css";
import styles1 from "../../styles/Searchinput.module.css";
import Slider2 from "../../components/AdComp3";
import { AccountContext } from "../../context/AccountProvider";
import { useRouter } from "next/router";
import Carousel2 from "../../components/Carousel2";
import HorizontalScroll from "../../components/DemoAd";
import Head from "next/head";
import EmblaCarouselComp from "../../components/Carousel/EmblaCarouselComp";
import { getDoctorsInCity } from "../../routes/directory";

const BestDoctors = ({ initialData }) => {
  const [showload, setshowload] = useState(false);
  const [loading, setloading] = useState(false);
  const [docs, setdocs] = useState(initialData);
  const [pageNum, setPageNum] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setinput] = useState({
    val: "",
  });

  const router = useRouter();
  const { docid } = router.query;

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);

  const jsonLdMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": initialData.map((doctor, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": doctor.name,
        "jobTitle": doctor.specialty,
        "url": `https://www.ayum.in/doctor?docid=${doctor._id}`,
        "openingHoursSpecification": doctor.timings && doctor.timings.map(([day , time]) => ({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day,
          "opens": time.split("-")[1],
          "closes": time.split("-")[2]
        })),
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": doctor.averageReview && doctor.averageReview,
          "reviewCount": doctor.reviews&&  doctor.reviews.length
        },
        "review": doctor.reviews && doctor.reviews.map((review) => ({
          "@type": "Review",
          "author": review.patientName,
          "reviewBody": review.comment,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating
          }
        }))
      },
    })),
  
  };
  

  const fetchMoreDocs = async () => {
    const nextPageNum = pageNum + 1;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/docdirectory/page?pageNum=${nextPageNum}`
    );
    const newData = await response.json();
    setdocs([...docs, ...newData]);
    setPageNum(nextPageNum);
  };
  const handleChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
    console.log(input);
  };

  return (
    <>
      <Head>
        <title>Best Doctors in Your City | Ayum</title>
        <meta
          name="description"
          content="Discover the top doctors in your city with Ayum. Find specialists based on your needs and location."
        />
        <meta
          name="keywords"
          content="best doctors, top doctors, medical directory, find doctors, specialists"
        />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMarkup) }}
        />
      </Head>

      <div className={`${styles.directorypage} h-[100vh] overflow-auto p-5`}>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className={styles1.searchform}
          action="#"
        >
          <div className="relative">
            <input
              type="search"
              id="search"
              name="val"
              className={styles1.searchinput}
              placeholder="Search Doctor..."
              onChange={(e) => handleChange(e)}
            />
            <button
              onClick={(e) => handleSubmit(e)}
              type="button"
              className={styles1.searchbtn}
            >
              Search
            </button>
          </div>
        </form>

        <div style={{ marginTop: "1.5rem", width: "100%" }}>
          {isMobile ? (
            <EmblaCarouselComp slidesData={slidesData} />
          ) : (
            <HorizontalScroll />
          )}
        </div>

        <div className={styles.directoryshell}>
          {loading ? (
            <div className="flex justify-center">
              <Image src="/loader.svg" width={40} height={40} alt="Loading" />
            </div>
          ) : (
            docs?.length > 0 &&
            docs.map((item) => (
              <DirectoryCard key={item._id} item={item} docid={docid} />
            ))
          )}
        </div>

        <div className="pb-20">
          {showload ? (
            <div className="m-auto p-2 border w-[8rem] text-center mt-9 font-bold cursor-pointer">
              Loading...
            </div>
          ) : (
            <div
              onClick={() => fetchMoreDocs()}
              className="m-auto p-2 border w-[8rem] text-center mt-9 font-bold cursor-pointer"
            >
              Show More
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BestDoctors;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const slugParts = slug.split("-");
  const extractedCity = slugParts[slugParts.length - 1];
  const extractedProfession = slugParts[1];

  const res = await getDoctorsInCity(extractedProfession, extractedCity, 10, 1);
  const initialData = res.doctors;

  return {
    props: {
      initialData: JSON.parse(JSON.stringify(initialData)),
    },
  };
}



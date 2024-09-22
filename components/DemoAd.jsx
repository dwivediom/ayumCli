import { useEffect, useRef, useState } from "react";
import styles from "../styles/Adcomp.module.css";
import Image from "next/image";
import axios from "axios";

export default function HorizontalScroll(props) {
  const [Intervalid, setIntervalid] = useState(null);
  const [slidesData, setslidesData] = useState();
  const GetAdsData = async () => {
    console.log("adsprops pc", props);
    const adurl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/ads?page=${props?.page}`;
    try {
      let userdata = await axios.get(adurl);
      setslidesData(userdata?.data);
    } catch (error) {
      console.log(error, "errorhere");
      setslidesData([]);
    }
  };

  const intervalRef = useRef();
  const containerRef = useRef(null);
  let index = 0;

  function handleScrollStart() {
    console.log("Hello");
    clearInterval(intervalRef.current);
    // setIntervalid(null);
  }

  function handleScrollEnd() {
    handleScroll();
  }

  function handleScroll() {
    const container = containerRef.current;
    if (container) {
      intervalRef.current = setInterval(() => {
        if (index >= 6) {
          index = 0;
        } else {
          container.scrollLeft = 370 * index;
          index = index + 1;
        }
      }, 3000);
    }
  }

  useEffect(() => {
    GetAdsData();
    handleScroll();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      {slidesData && (
        <div
          className={styles.scrollingContainer}
          ref={containerRef}
          onMouseEnter={handleScrollStart}
          onMouseLeave={handleScrollEnd}
          onTouchStart={handleScrollStart}
          onTouchEnd={() => {
            setTimeout(() => {
              handleScrollEnd();
            }, 3000);
          }}
          style={{
            marginTop: "1rem",
          }}
        >
          <div className={styles.scrollingDiv}>
            {slidesData.map(({ id, image, title }) => {
              return (
                <div key={id} className={`${styles.passbox} `}>
                  <div className={`${styles.passimg} `}>
                    <Image
                      style={{
                        borderRadius: "8px",
                      }}
                      layout="fill"
                      objectFit="cover"
                      objectPosition={
                        id == 1 || id == 2 || id == 3 || id == 4
                          ? `center 30%`
                          : `center 17%`
                      }
                      src={image}
                      alt="ad"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

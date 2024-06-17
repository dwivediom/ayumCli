import { useEffect, useRef, useState } from "react";
import styles from "../styles/Adcomp.module.css";
import Image from "next/image";

export default function HorizontalScroll({ page }) {
  const [Intervalid, setIntervalid] = useState(null);
  const [slidesData, setslidesData] = useState();
  const GetAdsData = async () => {
    const adurl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/ads?page=${page}`;
    try {
      let userdata = await axios.get(adurl);
      setslidesData(userdata?.data);
    } catch (error) {
      console.log(error, "errorhere");
      setslidesData([]);
    }
  };
  useEffect(() => {
    GetAdsData();
  }, []);

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
            {slidesData.map(({ id, imageSrc, title }) => {
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
                      src={imageSrc}
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

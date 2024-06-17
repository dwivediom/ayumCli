import React, { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles2 from "../../styles/embla.module.css";
import Autoplay from "embla-carousel-autoplay";
import styles from "../../styles/Adcomp.module.css";
import Image from "next/image";
import axios from "axios";
export default function EmblaCarouselComp(props) {
  const [slidesData2, setslidesData2] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 3000 }),
  ]);
  console.log(slidesData2, "ad data");
  const GetAdsData = async () => {
    const adurl = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/ads?page=${props.page}`;
    try {
      let userdata = await axios.get(adurl);
      setslidesData2(userdata?.data);
    } catch (error) {
      console.log(error, "errorhere");
      setslidesData2([]);
    }
  };
  useEffect(() => {
    GetAdsData();
  }, []);
  return (
    <>
      {slidesData2.length > 0 && (
        <div className={`${styles2.embla}`} ref={emblaRef}>
          <div className={`${styles2.embla__container}`}>
            {slidesData2?.map(({ position, image, title }, index) => {
              return (
                <div
                  onMouseEnter={() => {
                    console.log("enter");
                  }}
                  onDrag={() => {
                    console.log("drag");
                  }}
                  onTouchEnd={() => {
                    console.log("touchmove");
                    setTimeout(() => {
                      const autoplay = emblaApi?.plugins()?.autoplay;
                      const play = autoplay.play;
                      play();
                      console.log("played");
                    }, [2000]);
                  }}
                  className={`${styles2.embla__slide}`}
                  key={index}
                >
                  <div className={`${styles.passbox} `}>
                    <div className={`${styles.passimg} `}>
                      <Image
                        style={{
                          borderRadius: "8px",
                        }}
                        layout="fill"
                        objectFit="cover"
                        loading="lazy"
                        objectPosition={
                          position == 1 ||
                          position == 2 ||
                          position == 3 ||
                          position == 4
                            ? `center 30%`
                            : `center 17%`
                        }
                        src={image}
                        alt="ad"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* <div className={`${styles2.embla__slide}`}>Slide 2</div>
        <div className={`${styles2.embla__slide}`}>Slide 3</div> */}
          </div>
          {/* <button className="embla__play" onClick={toggleAutoplay} type="button">
        {isPlaying ? "Stop" : "Start"}
      </button> */}
        </div>
      )}
    </>
  );
}

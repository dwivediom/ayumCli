import React, { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles2 from "../../styles/embla.module.css";
import Autoplay from "embla-carousel-autoplay";
import styles from "../../styles/Adcomp.module.css";
import Image from "next/image";
export default function EmblaCarousel({ slidesData }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 3000 }),
  ]);

  // useEffect(() => {
  //   if (emblaApi) {
  //     console.log(emblaApi.slideNodes()); // Access API
  //   }
  // }, [emblaApi]);

  const [isPlaying, setIsPlaying] = useState(false);
  const onButtonAutoplayClick = useCallback(
    (callback) => {
      const autoplay = emblaApi?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [emblaApi]
  );
  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
    playOrStop();
  }, [emblaApi]);
  return (
    <div className={`${styles2.embla}`} ref={emblaRef}>
      <div className={`${styles2.embla__container}`}>
        {slidesData.map(({ id, imageSrc, title }, index) => {
          return (
            <div
              onScroll={() => {
                setTimeout(() => {
                  const autoplay = emblaApi?.plugins()?.autoplay;
                  const play = autoplay.play;
                  play();
                }, [5000]);
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
  );
}
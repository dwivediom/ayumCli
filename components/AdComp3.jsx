import { useEffect, useRef, useState } from "react";
import styles from "../styles/Adcomp.module.css";
import Image from "next/image";

export default function Slider2() {
  const [Intervalid, setIntervalid] = useState(null);
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
    {
      id: 7,
      imageSrc: "/contact2.jpg",
      title: "Slide 7",
    },
    {
      id: 8,
      imageSrc: "/contact2.jpg",
      title: "Slide 8",
    },
    {
      id: 9,
      imageSrc: "/contact2.jpg",
      title: "Slide 9",
    },
  ];

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

    intervalRef.current = setInterval(() => {
      if (index >= 6) {
        index = 0;
      } else {
        container.scrollLeft = 368 * index;
        index = index + 1;
      }
    }, 3000);
  }

  useEffect(() => {
    handleScroll();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
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
  );
}

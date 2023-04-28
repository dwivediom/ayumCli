import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Adcomp.module.css";

const slidesData = [
  {
    id: 6,
    imageSrc: "https://i.ibb.co/ZXcC6Gp/Ayum-6.png",
    title: "Slide 5",
  },
  {
    id: 7,
    imageSrc: "https://i.ibb.co/R4xmXHw/Ayum-7.png",
    title: "Slide 7",
  },

  {
    id: 2,
    imageSrc: "https://i.ibb.co/5MKMQt7/Ayum-1.png",
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

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
      }, 2500);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const handleManualSlide = (index) => {
    setIsPaused(true);
    setActiveIndex(index);
  };

  const handleAutoSlide = () => {
    setIsPaused(false);
  };

  return (
    <div className={`${styles.adcontainer}`}>
      <div
        className={`${styles.adshell}`}
        style={{
          transform: `translateX(${-activeIndex * 23}rem)`,
          display: "flex",
          transition: "1.5s all",
        }}
      >
        {slidesData.map(({ id, imageSrc, title }) => (
          <div key={id} className={`${styles.passbox} `}>
            <div className={`${styles.passimg} `}>
              <Image
                style={{
                  borderRadius: "8px",
                }}
                layout="fill"
                objectFit="cover"
                objectPosition={
                  id == 1 || id == 4 || id == 5 ? `center 17%` : `center 30%`
                }
                src={imageSrc}
                alt="ad"
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className={`${styles.manualcontrol}`}
        onMouseEnter={handleAutoSlide}
        onMouseLeave={handleAutoSlide}
      >
        {slidesData.map(({ id }, index) => (
          <label key={id}>
            <input
              type="radio"
              className={styles.radiobtn}
              name="slider"
              checked={activeIndex === index}
              onChange={() => handleManualSlide(index)}
            />
            <span></span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Slider;

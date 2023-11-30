import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import styles from "../styles/Adcomp.module.css";

const Carousel2 = () => {
  const slidesData = [
    {
      id: 0,
      imageSrc: "https://i.ibb.co/ZXcC6Gp/Ayum-6.png",
      title: "Slide 1",
    },
    {
      id: 1,
      imageSrc: "https://i.ibb.co/R4xmXHw/Ayum-7.png",
      title: "Slide 2",
    },
    {
      id: 2,
      imageSrc: "https://i.ibb.co/5MKMQt7/Ayum-1.png",
      title: "Slide 3",
    },
    {
      id: 3,
      imageSrc: "https://i.ibb.co/HndrXXQ/Ayum-2.png",
      title: "Slide 4",
    },
    {
      id: 4,
      imageSrc: "https://i.ibb.co/WpW5vS6/Ayum-4.png",
      title: "Slide 5",
    },
    {
      id: 5,
      imageSrc: "https://i.ibb.co/XSh3b0d/Ayum.png",
      title: "Slide 6",
    },
  ];

  const [imgurl, setimgurl] = useState("https://i.ibb.co/ZXcC6Gp/Ayum-6.png");
  const [imgid, setimgid] = useState(0);
  const ChangeImages = (index) => {
    console.log(index, "img");
    setimgurl(slidesData[index].imageSrc);
  };
  const [timeoutId, setTimeoutId] = useState(null);
  const timeoutRef = useRef();

  const [forward, setforward] = useState(true);
  const startScroll = () => {
    const id = setTimeout(() => {
      if (imgid < slidesData.length - 1) {
        setforward(true);
        setimgid(imgid + 1);
        ChangeImages(imgid + 1);
      } else {
        setforward(true);
        setimgid(0);
        ChangeImages(0);
      }
    }, 4000);

    setTimeoutId(id);

    // Alternatively, store the timeout ID in the ref
    timeoutRef.current = id;
  };

  const stopTimeout = () => {
    // Clear the timeout using the stored ID
    clearTimeout(timeoutId);

    // Alternatively, clear the timeout using the ref
    clearTimeout(timeoutRef.current);

    // Reset the timeout ID in state
    setTimeoutId(null);
  };

  useEffect(() => {
    startScroll();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [imgid]);

  return (
    <>
      <div className={`${styles.mobilecarousel} `}>
        <div
          className={`${styles.controlbtn} `}
          onClick={() => {
            stopTimeout();
            if (imgid > 0) {
              setimgid(imgid - 1);
              ChangeImages(imgid - 1);
            } else {
              setimgid(slidesData.length - 1);
              ChangeImages(slidesData.length - 1);
            }
          }}
        >
          {"<"}
        </div>
        <div key={imgurl} className={`${styles.passimg}  `}>
          <Image
            style={{
              borderRadius: "8px",
            }}
            className={`${forward && styles.forwardanimate}`}
            layout="fill"
            objectPosition={
              imgid == 0 || imgid == 1 || imgid == 2 || imgid == 3
                ? `center 30%`
                : `center 17%`
            }
            objectFit="cover"
            src={imgurl && imgurl}
            alt="ad"
          />
        </div>
        <div
          className={`${styles.controlbtn} `}
          onClick={() => {
            stopTimeout();
            if (imgid < slidesData.length - 1) {
              setimgid(imgid + 1);
              ChangeImages(imgid + 1);
            } else {
              setimgid(0);
              ChangeImages(0);
            }
          }}
        >
          {">"}
        </div>
      </div>
      <div className={`${styles.sldiercount} `}>
        {slidesData.map((x) => {
          return (
            <div
              style={{
                backgroundColor: x.id == imgid ? " rgb(9, 229, 225)" : "white",
              }}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export default Carousel2;

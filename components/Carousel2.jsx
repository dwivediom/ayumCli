import Image from "next/image";
import { useEffect, useState } from "react";
import Swipe from "react-easy-swipe";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import styles from "../styles/Phonebook.module.css";
export default function Carousel() {
  const images = [
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
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    let newSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
  };

  const handlePrevSlide = () => {
    let newSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
  };

  const changeSlide = () => {
    setTimeout(() => {
      handleNextSlide();
    }, 3500);
  };

  useEffect(() => {
    changeSlide();
  }, [currentSlide]);
  return (
    <div style={{ height: "300px" }} className="relative">
      {/* <AiOutlineLeft
        style={{
          position: "absolute",
          top: "2rem",
          background: "rgba(25,255,255,0.5)",
          height: "35px",
          width: "35px",
          borderRadius: "50%",
        }}
        onClick={handlePrevSlide}
        className="absolute left-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
      /> */}
      <div className="w-full h-[50vh] flex overflow-hidden relative m-auto">
        <Swipe
          onSwipeLeft={handleNextSlide}
          onSwipeRight={handlePrevSlide}
          className="relative z-10 w-full h-full"
          style={{
            margin: "5px",
            borderRadius: "24px",
            border: "2px solid rgba(245,245,245,0.4)",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "265px",
            marginTop: "15px",
            boxShadow: "0 1px 12px rgba(190, 193, 203, 0.882)",
          }}
        >
          {images.map((image, index) => {
            if (index === currentSlide) {
              return (
                <Image
                  height={320}
                  width={500}
                  key={image.id}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 3px 8px rgba(203, 203, 203, 0.582)",
                  }}
                  src={image.imageSrc}
                  layout="fill"
                  //   objectFit="contain"
                  className={`${styles.imagefade}`}
                />
              );
            }
          })}
        </Swipe>
      </div>
      {/* <AiOutlineRight
        onClick={handleNextSlide}
        style={{
          position: "absolute",
          top: "2rem",
          background: "rgba(25,255,255,0.5)",
          height: "35px",
          width: "35px",
          borderRadius: "50%",
        }}
        className="absolute right-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
      /> */}

      <div
        style={{
          position: "absolute",
          top: "18.5rem",
          zIndex: 500,
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
        className="relative flex justify-center p-2"
      >
        {images.map((_, index) => {
          return (
            <div
              className={
                index === currentSlide
                  ? "h-4 w-4 bg-gray-700 rounded-full mx-2 mb-2 cursor-pointer"
                  : "h-4 w-4 bg-gray-300 rounded-full mx-2 mb-2 cursor-pointer"
              }
              style={{ width: "10px", height: "10px" }}
              key={index}
              onClick={() => {
                setCurrentSlide(index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { animateScroll as scroll } from "react-scroll";

function MyPage() {
  const [bgColor, setBgColor] = useState("white");
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.pageYOffset;
      if (scrollPosition >= window.innerHeight * 0.1) {
        scrollToSection2(3000);
      } else {
        setBgColor("white");
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToSection2(scrollOffset) {
    const section2TopPosition = section2Ref.current.offsetTop;
    scroll.scrollTo(section2TopPosition + scrollOffset, {
      duration: 500,
      smooth: true,
    });
  }

  return (
    <div
      className="relative h-full w-full"
      style={{
        transition: "1s all",
      }}
    >
      <section
        ref={section1Ref}
        style={{
          height: "100vh",
          transition: "1s all",
          border: "2px solid red",
        }}
      >
        <button onClick={() => scrollToSection2(3000)}>
          Scroll to section 2
        </button>
        section 1
      </section>
      <section
        ref={section2Ref}
        style={{
          height: "100vh",
          transition: "1s all",
          border: "2px solid blue",
        }}
      >
        section 2
      </section>
    </div>
  );
}

export default MyPage;

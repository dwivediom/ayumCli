import React, { useEffect, useState } from "react";
import styles from "../styles/Adcomp.module.css";

const AdComp = () => {
  const [newstyle, setstyle] = useState();
  const [active, setactive] = useState(false);
  const [control, setcontrol] = useState(false);
  const [intid, setid] = useState();
  let index = 1;
  useEffect(() => {
    RunInterval();
    return () => clearInterval(intid);
  }, [active]);

  const handleSlide = (val) => {
    setcontrol(false);
    // console.log("val", val);
    setstyle({
      transform: `translateX(-${val}rem)`,
      transition: "1.5s all",
    });

    // console.log(newstyle && newstyle);
    setTimeout(() => {
      setcontrol(true);
    }, 2500);
  };

  const handleRadio = (e) => {
    // index = e.target.value;
    setactive(true);
    let val = 11 * e.target.value;
    handleSlide(val);
    // console.log(e.target.value);
  };

  const RunInterval = () => {
    let indexval = 0;

    const id = setInterval(() => {
      if (indexval <= 88) {
        handleSlide(indexval);
        indexval = index * 11;
        // console.log(index, "index hai");
        index = index + 1;
      } else {
        indexval = 0;
        index = 1;
      }
    }, 2000);

    setid(id);
  };

  const StopInterval = () => {
    console.log("Heee", intid);
    clearInterval(intid);
    // StopInterval(intid);
  };
  return (
    <>
      <div className={`${styles.adcontainer}`}>
        <div
          style={newstyle && newstyle}
          id="adshell"
          className={`${styles.adshell}`}
        >
          <div className={`${styles.passbox}`}>
            <div className={`${styles.passimg} bg-red-400`}></div>
          </div>
          <div className={`${styles.passbox}`}>
            <div className={`${styles.passimg} bg-violet-400`}></div>
          </div>
          <div className={`${styles.passbox}`}>
            <div className={`${styles.passimg} bg-green-400`}></div>
          </div>
          <div className={`${styles.passbox}`}>
            <div className={`${styles.passimg} bg-yellow-400`}></div>
          </div>
          <div className={`${styles.passbox}`}>
            <div className={`${styles.passimg} bg-orange-400`}></div>
          </div>
        </div>
      </div>
      {
        <div
          onMouseLeave={() => RunInterval()}
          className={`${styles.manualcontrol}`}
          onMouseEnter={() => StopInterval()}
          style={{
            border: "2px solid red",
          }}
        >
          <div>Left</div>
          <div>Right</div>
        </div>
      }
    </>
  );
};

export default AdComp;

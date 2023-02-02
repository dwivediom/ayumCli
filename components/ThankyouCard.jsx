import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";

const ThankyouCard = () => {
  return (
    <>
      <div className={`${styles.thankyouframe}`}>
        <h1>Special Thanks To 💖 </h1>
        <div className={`${styles.thankyoucontainer}`}>
          <div className={`${styles.thankyoucard} p-2`}>
            <div className={`${styles.thankyoudetail} `}>
              Barkha Upadhyay <br />
              Senior Technical Consultant <br />
              <span className="text-sm"> (Jabalpur Incubation Center) </span>
            </div>
            <div className={`${styles.thankyouimg} `}>
              <Image
                width={85}
                style={{ borderRadius: "50%" }}
                height={85}
                loading="lazy"
                src={"/barkha.jpg"}
                alt={"Barkha Upadhyay"}
              />{" "}
            </div>
          </div>
          <div className={`${styles.thankyoucard} p-2`}>
            <div className={`${styles.thankyoudetail} `}>
              Dr BL Mishra
              <br />
              CMHO Rewa ,sidhi <br />
              <span className="text-sm">
                (Medical specialist at kushabahu thakre rewa)
              </span>
            </div>
            <div className={`${styles.thankyouimg} `}>
              <Image
                width={85}
                style={{ borderRadius: "50%" }}
                height={85}
                loading="lazy"
                src={"/bl.jpeg"}
                alt={"Dr BL Mishra"}
              />{" "}
            </div>
          </div>
          <div className={`${styles.thankyoucard} p-2`}>
            <div className={`${styles.thankyoudetail} `}>
              Dr Dheerendra Mishra
              <br />
              MD , DNB <br />{" "}
              <span className="text-sm">
                (Asso. Member of International headache society)
              </span>
            </div>
            <div className={`${styles.thankyouimg} `}>
              <Image
                width={85}
                style={{ borderRadius: "50%" }}
                height={85}
                loading="lazy"
                src={"/dhreendra.jpeg"}
                alt={"Dr Dheerendra Mishra"}
              />{" "}
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default ThankyouCard;

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setDocDataAction } from "../redux/actions/userActions";
import styles from "../styles/doctorcard.module.css";
import Image from "next/image";
import { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";

const DoctorCard = (props) => {
  const router = useRouter();
  const { name, specialist, location, fees, phone, timing, docid, pic } = props;
  console.log(pic, "Picture hai");
  const { lang } = useContext(AccountContext);
  const [docpic, setdocpic] = useState();
  useEffect(() => {
    if (pic && pic.includes("googleusercontent.com")) {
      const index = pic.indexOf("=");
      const result = pic.slice(0, index);
      setdocpic(result);
    } else if (pic) {
      setdocpic(pic);
    }
  }, []);
  const dispatch = useDispatch();
  const Click = (e) => {
    if (localStorage.usertoken) {
      router.push({
        pathname: "/clinics",
        query: {
          did: docid,
        },
      });
    }
  };
  return (
    <div
      onClick={() => {
        router.push(`/doctor?docid=${docid}`);
      }}
      className={`${styles.doctorcard}`}
    >
      <div className={`${styles.bottomc1}`}></div>
      <div className={`${styles.bottomc2}`}></div>
      <div className={`${styles.topsvg}`}></div>
      <div className={`${styles.blob}`}>
        <Image
          style={{ borderRadius: "50%" }}
          src={docpic ? docpic : "/deafaultpro.jpg"}
          width={100}
          height={100}
          alt="doc pic"
        />
      </div>

      <div className={`${styles.doccontent}`}>
        <h2>{name}</h2>
        <div className={`${styles.specialist}`}>{specialist}</div>
        <div className={`${styles.content}`}>
          {" "}
          <span>{phone} </span>
          <div className={`${styles.imgbox}`}>
            <img
              src="https://img.icons8.com/ios/50/00b6d6/phone--v1.png"
              alt="phone"
            />
          </div>
        </div>
        <button
          style={{ border: "none", outline: "none" }}
          onClick={(e) => Click(e)}
          className={`${styles.bookslot}`}
        >
          {lang == "en" ? English.bookslotbtn : Hindi.bookslotbtn}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;

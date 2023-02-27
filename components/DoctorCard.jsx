import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setDocDataAction } from "../redux/actions/userActions";
import styles from "../styles/doctorcard.module.css";
import Router from "next/router";
import Image from "next/image";

const DoctorCard = (props) => {
  const { name, specialist, location, fees, phone, timing, docid, pic } = props;
  console.log(pic, "Picture hai");
  const [docpic, setdocpic] = useState();
  useEffect(() => {
    if (pic) {
      const index = pic.indexOf("=");
      const result = pic.slice(0, index);
      setdocpic(result);
    }
  }, []);
  const dispatch = useDispatch();
  const Click = (e) => {
    e.preventDefault();
    console.log(localStorage.usertoken, "user token ");
    console.log(docid);
    dispatch(setDocDataAction(props));

    if (localStorage.usertoken) {
      Router.push({
        pathname: "/User/SelectClinic",
        query: {
          did: docid,
        },
      });
    } else {
      Router.push("/User/UserRegistrationPage");
    }
  };
  return (
    <div className={`${styles.doctorcard}`}>
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
          <span>{phone}</span>
          <div className={`${styles.imgbox}`}>
            <img
              src="https://img.icons8.com/ios/50/00b6d6/phone--v1.png"
              alt="phone"
            />
          </div>
        </div>
        <button onClick={(e) => Click(e)} className={`${styles.bookslot}`}>
          Book Slot
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;

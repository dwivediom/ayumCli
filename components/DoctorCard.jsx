import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { setDocDataAction } from "../redux/actions/userActions";
import styles from "../styles/doctorcard.module.css";

const DoctorCard = (props) => {
  const { name, specialist, location, fees, phone, timing } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const Click = (e) => {
    e.preventDefault();

    dispatch(setDocDataAction(props));

    if (localStorage.usertoken) {
      router.push("/User/BookAppointmentPage");
    } else {
      router.push("/User/UserRegistrationPage");
    }
  };
  return (
    <div className={`${styles.doctorcard}`}>
      <div className={`${styles.bottomc1}`}></div>
      <div className={`${styles.bottomc2}`}></div>
      <div className={`${styles.topsvg}`}></div>
      <div className={`${styles.blob}`}>
        <div
          style={{
            backgroundImage: "url(/deafaultpro.jpg)",
          }}
          className={`${styles.blobimg}`}
        ></div>
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

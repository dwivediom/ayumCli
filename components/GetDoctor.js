import React, { useEffect, useState } from "react";
import styles from "../styles/doctorcard.module.css";
import DoctorCard from "./DoctorCard";

const GetDoctor = ({ getDoctor }) => {
  console.log(getDoctor, "Get DOctor");
  return (
    <>
      <div className={`${styles.doccontainer}`}>
        {getDoctor && getDoctor != "error" ? (
          getDoctor.map((item) => {
            if (item.doctor)
              return (
                <DoctorCard
                  key={item._id}
                  pic={item.doctor.picture && item.doctor.picture}
                  name={item.doctor && item.doctor.name}
                  specialist={item.specialist && item.specialist}
                  location={item.location && item.location}
                  phone={item.doctor && item.doctor.phone}
                  fees={item.fees && item.fees}
                  timing={item.timing && item.timing}
                  docid={item.doctor && item.doctor._id}
                />
              );
          })
        ) : (
          <div className="text-red-500 text-center font-bold">
            Data is Unavailable For Now! <br />
            Reload the page or Check Internet Speed
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(GetDoctor);

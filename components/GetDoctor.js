import React, { useEffect, useState } from "react";
import styles from "../styles/doctorcard.module.css";
import DoctorCard from "./DoctorCard";

const GetDoctor = ({ getDoctor }) => {
  return (
    <>
      <div className={`${styles.doccontainer}`}>
        {getDoctor
          .slice(0)
          .reverse()
          .map((item) => {
            if (item.doctor)
              return (
                <DoctorCard
                  key={item._id}
                  name={item.doctor && item.doctor.name}
                  specialist={item.specialist && item.specialist}
                  location={item.location && item.location}
                  phone={item.doctor && item.doctor.phone}
                  fees={item.fees && item.fees}
                  timing={item.timing && item.timing}
                  docid={item.doctor && item.doctor._id}
                />
              );
          })}
      </div>
    </>
  );
};

export default React.memo(GetDoctor);

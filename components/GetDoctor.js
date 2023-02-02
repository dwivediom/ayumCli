import React, { useEffect, useState } from "react";
import styles from "../styles/doctorcard.module.css";
import dynamic from "next/dynamic";
const Doctor = dynamic(() => import("./Doctor"));
import Image from "next/image";
import DoctorCard from "./DoctorCard";

const GetDoctor = ({ getDoctor }) => {
  return (
    <>
      <div className={`${styles.doccontainer}`}>
        {getDoctor
          .slice(0)
          .reverse()
          .map((doctor) => {
            return (
              // <Doctor
              //   key={doctor._id}
              //   name={doctor.doctor.name}
              //   specialist={doctor.specialist}
              //   location={doctor.location}
              //   phone={doctor.doctor.phone}
              //   fees={doctor.fees}
              //   timing={doctor.timing}
              //   docid={doctor.doctor._id}
              // />
              <DoctorCard
                key={doctor._id}
                name={doctor.doctor.name}
                specialist={doctor.specialist}
                location={doctor.location}
                phone={doctor.doctor.phone}
                fees={doctor.fees}
                timing={doctor.timing}
                docid={doctor.doctor._id}
              />
            );
          })}
      </div>
    </>
  );
};

export default React.memo(GetDoctor);

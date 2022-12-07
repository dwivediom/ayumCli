import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../redux/store/store";
import { getallDoctorAction } from "../redux/actions/docActions";
import dynamic from "next/dynamic";
import styles from "../styles/loader.module.css";
const Doctor = dynamic(() => import("./Doctor"));
import Image from "next/image";

const GetDoctor = ({ getDoctor }) => {
  // const dispatch = useDispatch();

  // const getDoctor = useSelector((state) => state.getDoctorReducer);

  // useEffect(() => {
  //   dispatch(getallDoctorAction());
  // }, [dispatch]);

  // if (getDoctor.loading) {
  //   return (
  //     <>
  //       <div
  //         style={{
  //           width: "100%",
  //           display: "flex",
  //           justifyContent: "center",
  //           marginTop: "2rem",
  //         }}
  //       >
  //         <div className={styles.dotsbars4}></div>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <div className="  md:grid m-auto  overflow-hidden md:grid-cols-2  lg:grid-cols-4  gap-3">
        {/* <div className={`${styles.doc_container}`} > */}
        {getDoctor
          .slice(0)
          .reverse()
          .map((doctor) => {
            return (
              <Doctor
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

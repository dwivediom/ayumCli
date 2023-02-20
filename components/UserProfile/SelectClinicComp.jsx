import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Bookappo.module.css";
import Router from "next/router";
import axios from "axios";

const SelectClinicComp = ({ docid }) => {
  console.log(docid && docid, "Doctor id from select clinic");
  const [clinic, setclinic] = useState();
  useEffect(() => {
    if (!docid) {
      Router.push("/");
    }
    async function getdoctordata() {
      const doctordata = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/profile/doctor/${docid}`
      );
      setclinic(doctordata.data.clinic && doctordata.data.clinic);
      console.log(doctordata.data.clinic, "doctor ka data ");
    }

    docid && getdoctordata();
  }, []);
  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
        }}
      >
        <h1 className="text-center font-bold text-lg text-cyan-500">
          Select The Clinic
        </h1>
        <div className={`${styles.cardcontainer}`}>
          {clinic &&
            clinic.map((item) => {
              return (
                <div key={item._id} className={`${styles.cliniccard}`}>
                  <h2>{item.clinicName}</h2>
                  <div className={`${styles.timebox}`}>
                    <div>
                      {" "}
                      <Image
                        src={
                          " https://img.icons8.com/fluency/48/null/overtime.png"
                        }
                        height={23}
                        width={23}
                      />{" "}
                      {item.timing}
                    </div>

                    <div>
                      {" "}
                      <Image
                        src={
                          "https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-limited-black-friday-cyber-monday-flaticons-flat-flat-icons.png"
                        }
                        width={23}
                        height={23}
                      />{" "}
                      Slots Remaining - <span className="text-red-500">30</span>
                    </div>
                  </div>
                  <div className={`${styles.locationbox} text-left`}>
                    <Image
                      src={
                        "https://img.icons8.com/external-flatart-icons-flat-flatarticons/64/null/external-location-coronavirus-flatart-icons-flat-flatarticons.png"
                      }
                      width={23}
                      height={23}
                    />
                    <span
                      style={{
                        width: "92%",
                      }}
                    >
                      {item.location}
                    </span>
                  </div>

                  {item.bookingStatus ? (
                    <div
                      onClick={() => {
                        Router.push({
                          pathname: "/User/BookAppointmentPage",
                          query: {
                            data: JSON.stringify({
                              docid: `${docid}`,
                              clinicid: `${item._id}`,
                            }),
                          },
                        });
                      }}
                      className={`${styles.continuebox}`}
                    >
                      Continue
                    </div>
                  ) : (
                    <div className="text-center mt-2 text-sm text-red-500 font-bold ">
                      Booking For This Clinic Are Closed For Now!
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default SelectClinicComp;

import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Bookappo.module.css";
import axios from "axios";
import { useRouter } from "next/router";

const SelectClinicComp = ({ docid }) => {
  const router = useRouter();
  console.log(docid && docid, "Doctor id from select clinic");
  const [clinic, setclinic] = useState();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    if (!docid) {
      router.push("/");
    }
    async function getdoctordata() {
      const doctordata = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/profile/doctor/${docid}`
      );
      setclinic(doctordata.data.clinic && doctordata.data.clinic);
      setloading(false);
      console.log(doctordata.data.clinic, " doctor ka data ");
    }

    docid && getdoctordata();
  }, []);
  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          paddingTop: "1rem",
        }}
      >
        <h1 className="text-center font-bold text-lg text-cyan-600">
          Select The Clinic
        </h1>
        <div className={`${styles.cardcontainer}`}>
          {loading ? (
            <div
              style={{
                width: "100vw",
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={"/loader.svg"}
                width={40}
                height={40}
                alt="Loading..."
              />
            </div>
          ) : (
            clinic &&
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
                        alt={"timing"}
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
                        alt={"remain"}
                      />{" "}
                      Total Slots -
                      <span className="text-red-500">{item.maxappo}</span>
                    </div>
                  </div>
                  <div className={`${styles.locationbox} text-left`}>
                    <Image
                      src={
                        "https://img.icons8.com/external-flatart-icons-flat-flatarticons/64/null/external-location-coronavirus-flatart-icons-flat-flatarticons.png"
                      }
                      width={23}
                      height={23}
                      alt={"location"}
                    />
                    <span
                      style={{
                        width: "92%",
                      }}
                    >
                      {item.location}
                    </span>
                  </div>
                  {item.notice && (
                    <div className={`${styles.locationbox} text-left`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 26 26"
                        strokeWidth={1.5}
                        stroke="red"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                        />
                      </svg>

                      <span
                        style={{
                          width: "92%",
                        }}
                      >
                        {item.notice}
                      </span>
                    </div>
                  )}

                  {item.bookingStatus ? (
                    <div
                      onClick={() => {
                        router.push({
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
                      Continue{" "}
                      <img
                        style={{
                          width: "20px",
                          height: "30px",
                          marginLeft: "5px",
                        }}
                        src="/leftside.gif"
                        alt="Animated GIF"
                      />
                    </div>
                  ) : (
                    <div className="text-center mt-2 text-sm text-red-500 font-bold ">
                      Booking For This Clinic Are Closed For Now!
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default SelectClinicComp;

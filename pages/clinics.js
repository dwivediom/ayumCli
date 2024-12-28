import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Bookappo.module.css";
import Image from "next/image";
import { convertTo12HourFormat } from "../public/utils/Utils";
// import { Button } from "primereact/button";
import { Button } from "primereact/button";
import { AccountContext } from "../context/AccountProvider";

const clinics = () => {
  const router = useRouter();
  const [clinics, setclinics] = useState([]);
  const GetClinics = async () => {
    console.log("functioncalled");
    try {
      const prodata = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_B_PORT}/api/user/getclinics?id=${router.query.id}`,
        headers: {
          "x-auth-token": localStorage.usertoken,
        },
        data: {},
      });
      console.log(prodata.data, "clinicsdata");
      setclinics(prodata.data?.data);
    } catch (error) {}
  };
  const { signout } = useContext(AccountContext);
  useEffect(() => {
    if (router.query.id) {
      GetClinics();
    }
  }, [router.query, signout]);
  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "teal",
          padding: "10px",
          fontSize: "1.2rem",
          marginTop: "1rem",
        }}
      >
        Choose Clinic
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        {clinics?.map((clinic, index) => {
          return (
            <div
              key={clinic.clinicName}
              className={`${styles.cliniccard}`}
              style={{
                position: "relative",
              }}
            >
              <h1>{clinic.clinicName}</h1>{" "}
              <div className={`${styles.clinicdetails}`}>
                <div className={`${styles.clinicmenus}`}>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-6"
                      style={{
                        width: "25px",
                        height: "25px",
                        color: "var(--teal-500)",
                      }}
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  {
                    <div
                      style={{
                        display: "flex",
                        overflow: "auto",
                        gap: "5px",
                        padding: "5px",
                      }}
                      className={`${styles.timingcardbox}`}
                    >
                      {clinic.timings
                        ?.filter((i) => i.doctorid == router.query.id)
                        ?.map((result, index) => {
                          console.log(result, "timingresulthere");
                          return (
                            <div
                              style={{ display: "flex", gap: "5px" }}
                              key={index}
                            >
                              {Object.keys(result.timing)?.map(
                                (item, subIndex) => (
                                  <div
                                    key={`${index}-${subIndex}`}
                                    className={`${styles.timingcard}`}
                                  >
                                    {result.timing[item].day} <br />
                                    {result.timing[item].closed ? (
                                      "Closed"
                                    ) : (
                                      <span>
                                        {convertTo12HourFormat(
                                          result.timing[item].startTime
                                        )}{" "}
                                        -{" "}
                                        {convertTo12HourFormat(
                                          result.timing[item].endTime
                                        )}
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          );
                        })}
                    </div>
                  }

                  {/* {clinic.timing} */}
                </div>
                {/* <div style={{ marginTop: "3px" }} className={`${styles.timing}`}>
              <img src="https://img.icons8.com/fluency/48/null/checked.png" />
              Max Slots - {clinic.maxappo}
            </div> */}
                <div className={`${styles.clinicmenus}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                    style={{
                      width: "25px",
                      height: "25px",
                      color: "var(--teal-500)",
                    }}
                  >
                    <path
                      fill-rule="evenodd"
                      d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {clinic.location}
                </div>
                <div className={`${styles.clinicmenus}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                    style={{
                      width: "25px",
                      height: "25px",
                      color: "var(--teal-500)",
                    }}
                  >
                    <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  {clinic.notice
                    ? clinic.notice
                    : "Add Any Notice For Patients!"}
                </div>
              </div>
              <Button
                label="Select"
                onClick={() => {
                  router.push(
                    `/User/BookAppointmentPage?docid=${router.query.id}&clinicid=${clinic._id}`
                  );
                }}
                icon="pi pi-check"
                style={{
                  background: "var(--teal-700)",
                  width: "fit-content",
                  padding: "7px 20px",
                  color: "white",
                  margin: "auto",
                  marginTop: "10px",
                }}
              />
            </div>
          );
        })}

        {clinics.length == 0 && (
          <div style={{ textAlign: "center" }}>
            <p>No Clinic Found ☹️</p>
            This doctor is not associated with any clinic!
          </div>
        )}
      </div>
    </div>
  );
};

export default clinics;

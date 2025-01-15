import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../../styles/UserAppo.module.css";
import { Button } from "primereact/button";
import { convertDateToDDMMMYYYY } from "../../public/utils/Utils";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";
const Appointment = (props) => {
  const { data } = props;
  const appodate = new Date(data.date);
  const [crn, setcrn] = useState();
  const [runcrn, setruncrn] = useState(true);
  const [message, setmessage] = useState("");
  const [expired, setexpired] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // console.log(props.timeDiffInDays, "Message hai ");
    if (props.timeDiffInDays == 0) {
      // console.log(props.timeDiffInDays);
      setmessage("today");
    } else if (props.timeDiffInDays > 7) {
      // console.log(props.timeDiffInDays);
      setmessage("expired");
    } else {
      setmessage(`${props.timeDiffInDays}`);
    }

    async function getcrn() {
      const crndata = await axios({
        url: `https://www.crn.ayum.in/CRN/get/${data.clinicId.toString()}`,
        method: "get",
      });
      // console.log(crndata.data, "Crn data");
      if (!crndata.data.CRN) {
        // console.log("khaali hai");
        setcrn(null);
      } else if (crndata.data != {}) {
        setcrn(crndata && crndata.data);
      }
    }
    if (data.clinicId) {
      getcrn();
    }
  }, [runcrn]);

  useEffect(() => {
    if (data?.end_time < Date.now) {
      setexpired(true);
    }
  }, []);
  const [vitalspopup, setvitalspopup] = useState(false);
  const [reportpopup, setreportpopup] = useState(false);
  const [prescriptiondata, setprescriptiondata] = useState();
  const [vitals, setvitals] = useState();

  useEffect(() => {
    if (vitalspopup) {
      getprescriptiondata();
    }
  }, [vitalspopup]);
  const getprescriptiondata = async () => {
    console.log("Getprescir");
    const prescribedata = await axios.get(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/getprescription?appointmentid=${props.data?._id}`
    );
    const finaldata = prescribedata?.data.data[0];
    setvitals(finaldata?.vitals);
    setprescriptiondata(finaldata);
  };
  return (
    <>
      {/* <div className={`${styles.userappocard}`}>
        <div
          style={{
            backgroundColor:
              message == "expired"
                ? "#FAA0A0	"
                : message == "today"
                ? "#90EE90"
                : "rgba(255, 241, 117, 1)",
            color: "black",
          }}
          className={`${styles.appbadge}`}
        >
          {message != "expired" ? (
            message == "today" ? (
              <span>Today</span>
            ) : (
              <span>{`Past ${message} day ago`}</span>
            )
          ) : (
            <span>Expired</span>
          )}
        </div>
        <h2>{data.patientname}</h2>
        <div className={`${styles.userdetailbox}`}>
          <i
            style={{ width: "20px", height: "20px" }}
            className="pi pi-hashtag"
          ></i>{" "}
          Slot No. - {data.appointmentno}
        </div>
        <div className={`${styles.userdetailbox}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
            style={{ width: "20px", height: "20px", marginLeft: "-2px" }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          Clinic - {data.clinicName} Botany Specialist Clinic
        </div>

        <div className={`${styles.userdetailbox}`}>
          <i
            style={{ width: "20px", height: "20px" }}
            className="pi pi-clock"
          ></i>{" "}
          Start Time - {data?.start_time.substring(0, 10)}
        </div>
        <div className={`${styles.userdetailbox}`}>
          {" "}
          <i
            style={{ width: "20px", height: "20px" }}
            className="pi pi-briefcase"
          ></i>{" "}
          Doctor Name - {data.docname} Dr. Rakesh Patel
        </div>

        <div className={`${styles.userdetailbox}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
            style={{ width: "20px", height: "20px" }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
            />
          </svg>
          Age - {data.age} years
        </div>
        <div className={`${styles.userdetailbox}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
            style={{ width: "20px", height: "20px" }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
          Phone - {data.phone}
        </div>

        {message != "expired" && (
          // <div className="text-center text-red-500 font-bold">Expired</div>
          <></>
          // <div className={`${styles.userdetail}`}>
          //   <div className={`${styles.CRNnumber} `}>
          //     <span> Current Running Number :</span>
          //     <span className="text-red-500"> {crn ? crn.CRN : "N/A"}</span>
          //   </div>
          //   <div
          //     onClick={() => setruncrn(!runcrn)}
          //     className={`${styles.crnrefresh} `}
          //   >
          //     Refresh
          //   </div>
          // </div>
        )}
      </div> */}

      <div
        style={{
          // border: "1px solid red",
          padding: "10px",
          minWidth: "21rem",
          borderRadius: "12px",
          background: "var(--surface-50)",
          boxShadow: "0 5px 5px rgba(0,0,0,0.1)",
        }}
        // className="shadow-md"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              src={
                data?.doctorInfo
                  ? data?.doctorInfo?.picture?.replace(/=s\d+-c/, "")
                  : ""
              }
            />
            {/* <span style={{ fontSize: "8px" }}>Doctor</span> */}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", width: "75%" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "5px",
                borderRadius: "4px",
                background: "white",

                height: "fit-content",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <span>
                {" "}
                <span style={{ color: "var(--teal-700)" }}>Doctor:</span>{" "}
                {data?.doctorInfo?.name}
              </span>

              <span>
                {" "}
                <span style={{ color: "var(--teal-700)" }}>
                  Patient Name:{" "}
                </span>{" "}
                {data?.patientname}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "white",
                marginTop: "5px",
                padding: "5px",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <span>
                {" "}
                <span style={{ color: "var(--teal-700)" }}>
                  Clinic Name:
                </span>{" "}
                {data?.clinicInfo?.clinicName}
              </span>
              <span>
                {" "}
                <span style={{ color: "var(--teal-700)" }}>
                  Clinic Address:
                </span>{" "}
                {data?.clinicInfo?.location}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: "10px 0",
              background: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              marginTop: "5px",
              borderRadius: "4px",
              gap: "5px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "48%",
                background: "var(--surface-100)",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              Date: {convertDateToDDMMMYYYY(data?.start_time)}
            </div>
            <div
              style={{
                width: "48%",
                background: "var(--surface-100)",
                padding: "5px",
                display: "flex",
                borderRadius: "4px",
              }}
            >
              Slot No:{" "}
              <span
                style={{
                  // padding: "10px",
                  borderRadius: "50%",
                  background: "var(--blue-600)",
                  fontWeight: "600",
                  width: "25px",
                  height: "25px",
                  marginLeft: "10px",
                  display: "block",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data?.slotno}
              </span>
            </div>
            <div
              style={{
                width: "48%",
                background: "var(--surface-100)",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              Age: {data?.age}
            </div>
            <div
              style={{
                width: "48%",
                background: "var(--surface-100)",
                padding: "5px",
                borderRadius: "4px",
                display: "flex",
              }}
            >
              Running No:{" "}
              <span
                style={{
                  // padding: "10px",
                  borderRadius: "4px",
                  background: "var(--teal-500)",
                  fontWeight: "600",
                  minWidth: "45px",
                  minHeight: "25px",
                  marginLeft: "10px",
                  display: "block",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* {data?.slotno} */} 100
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              background: "white",
              padding: "5px",
              gap: "10px",
              justifyContent: "center",
              marginTop: "5px",
            }}
          >
            <Button
              onClick={() => setvitalspopup(true)}
              label="Vitals"
              icon="pi pi-wave-pulse"
              outlined
            />
            <Button
              style={{
                position: "static",
                padding: "7px",
                color: "var(--blue-600)",
              }}
              label={"Reports"}
              icon=" pi pi-headphones"
              onClick={() => {
                // setlabtestpopup(true);
                setreportpopup(true);
              }}
              outlined
            />{" "}
            <Button
              label="Prescription"
              icon=" pi pi-file-edit"
              onClick={() => {
                router.push(`/previewprescription?ap=${data?._id}`);
              }}
            />
          </div>
        </div>
      </div>
      <Dialog
        visible={vitalspopup}
        onHide={() => {
          setvitalspopup(false);
        }}
        position="top"
        style={{ width: "100%" }}
        header="Your Vitals"
      >
        <span
          style={{
            display: "flex",
            gap: "5px",
            flexWrap: "wrap",
            flexDirection: "column",
            padding: "8px 0",
            borderRadius: "4px",
            // background: "var(--surface-100)",
          }}
        >
          <span
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
            }}
          >
            {vitals ? (
              Object.keys(vitals).length > 0 &&
              Object.keys(vitals).map((item, idx) => {
                return (
                  <span
                    style={{
                      background: "var(--teal-600)",
                      padding: "10px",
                      // color: "var(--teal-600)",
                      border: "1px solid var(--teal-600)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    key={idx}
                  >
                    {item?.charAt(0).toUpperCase() + item.slice(1)} -{" "}
                    {vitals[item]}{" "}
                  </span>
                );
              })
            ) : (
              <div style={{ textAlign: "center", width: "100%" }}>
                No Vitals Collected!
              </div>
            )}
          </span>

          {/* Weight - 80 , Height {"cm"} 200 , B.M.I - 200 , Bp - 120/80 mmHg */}
        </span>
      </Dialog>
      <Dialog
        visible={reportpopup}
        onHide={() => {
          setreportpopup(false);
        }}
        position="top"
        header="Your Lab Report"
      ></Dialog>
    </>
  );
};

export default Appointment;

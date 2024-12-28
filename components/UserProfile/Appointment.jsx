import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../../styles/UserAppo.module.css";
const Appointment = (props) => {
  const { data } = props;
  const appodate = new Date(data.date);
  const [crn, setcrn] = useState();
  const [runcrn, setruncrn] = useState(true);
  const [message, setmessage] = useState("");
  const [expired, setexpired] = useState(false);

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

  return (
    <>
      <div className={`${styles.userappocard}`}>
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
      </div>
    </>
  );
};

export default Appointment;

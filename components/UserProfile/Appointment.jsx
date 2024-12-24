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
          <i className="pi pi-hashtag"></i> Slot No. - {data.appointmentno}
        </div>
        <div className={`${styles.userdetailbox}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
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
          Clinic - {data.clinicName}{" "}
        </div>

        <div className={`${styles.userdetailbox}`}>
          <i className="pi pi-clock"></i> Start Time -{" "}
          {data?.start_time.substring(0, 10)}
        </div>
        <div className={`${styles.userdetailbox}`}>
          {" "}
          <i className="pi pi-briefcase"></i> Doctor Name - {data.docname}
        </div>

        <div className={`${styles.userdetailbox}`}>{data.age} years</div>
        <div className={`${styles.userdetailbox}`}>{data.phone}</div>

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

import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../../styles/UserAppo.module.css";
const Appointment = (props) => {
  const { data } = props;
  const appodate = new Date(data.date);
  const [crn, setcrn] = useState();
  const [runcrn, setruncrn] = useState(true);

  useEffect(() => {
    console.log(data.clinicId, "Clinic id for CRN");
    async function getcrn() {
      const crndata = await axios({
        url: `https://www.crn.ayum.in/CRN/get/${data.clinicId.toString()}`,
        method: "get",
      });
      console.log(crndata);
      if (crndata.data != {}) {
        setcrn(crndata && crndata.data);
      }
    }
    if (data.clinicId) {
      getcrn();
    }
  }, [runcrn]);
  return (
    <>
      <div className={`${styles.userappocard}`}>
        <h2>{data.patientname}</h2>
        <div className={`${styles.userdetail}`}>
          <div>Slot Number - {data.appointmentno}</div>
          <div>Clinic - {data.clinicName} </div>
        </div>
        <div className={`${styles.userdetail}`}>
          <div>
            {" "}
            <img src="https://img.icons8.com/fluency/48/null/overtime.png" />{" "}
            {data.date.substring(0, 10)}
          </div>
          <div>
            <img src="https://img.icons8.com/color/48/null/medical-doctor.png" />{" "}
            {data.docname}
          </div>
        </div>

        <div className={`${styles.userdetail}`}>
          <div>
            <img src="https://img.icons8.com/external-stick-figures-gan-khoon-lay/51/null/external-age-life-cycle-aging-stick-figures-gan-khoon-lay-2.png" />{" "}
            {data.age} years
          </div>
          <div>
            <img src="https://img.icons8.com/color/48/null/contact-card.png" />{" "}
            {data.phone}
          </div>
        </div>
        <div className={`${styles.userdetail}`}>
          <div className={`${styles.CRNnumber} `}>
            <span> Current Running Number :</span>
            <span className="text-red-500">
              {" "}
              {crn && crn != {} ? crn.CRN : "N/A"}
            </span>
          </div>
          <div
            onClick={() => setruncrn(!runcrn)}
            className={`${styles.crnrefresh} `}
            style={{ width: "30%" }}
          >
            Refresh
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;

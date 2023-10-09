import React from "react";
import styles1 from "../../styles/booktest.module.css";
import styles from "../../styles/newchat.module.css";
import English from "../../public/locales/en/labtest";
import Hindi from "../../public/locales/hi/labtest";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";

const BloodRequest = () => {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.usertoken || !localStorage.labuser) {
      router.push("/User/UserRegistrationPage");
    }

    return;
  }, []);

  const { lang } = useContext(AccountContext);
  const [requestsent, setrequestsent] = useState(false);
  const [inputdata, setinputdata] = useState({
    name: "",
    phoneNumber: "",
    hospital: "",
    bloodgroup: "",
    acceptterm: false,
  });
  const handleChange = (e) => {
    console.log(e.target.value);
    e.preventDefault();
    setinputdata({ ...inputdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/bloodreq`;
    console.log(inputdata);
    try {
      const UserData = JSON.parse(localStorage.getItem("labuser"));
      axios
        .post(
          url,
          { ...inputdata, userID: UserData?.email },
          {
            headers: {
              "x-auth-token": localStorage.usertoken,
            },
          }
        )
        .then((data) => {
          console.log(data);
          if (data.data.id) {
            let forwardurl = `/Other/Bloodrecieve?reqid=${data.data.id}`;
            router.push(forwardurl);
            setrequestsent(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error, "Err");
    }
  };
  const [inputactive, setinputactive] = useState(0);
  return (
    <div className={`${styles.chatpage}`} id="chatpage">
      <div id="component1" className={styles1.reportcontainer}>
        <div
          style={{ backgroundColor: " rgba(248, 157, 150, 0.15)" }}
          className={`${styles1.reportshell} shadow-xl`}
        >
          <div className={`${styles1.reportform} `}>
            <div
              style={{
                display: "block",
              }}
            >
              <h1
                style={{
                  color: "rgb(162, 6, 6)",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                {lang == "en" ? English.reqblood : Hindi.reqblood}
              </h1>
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => handleChange(e)}
                value={inputdata.name}
                name="name"
                className="shadow-md "
                placeholder={lang == "en" ? English.entername : Hindi.entername}
              />
            </div>
            <div>
              <input
                type="number"
                onChange={(e) => handleChange(e)}
                value={inputdata.phone}
                name="phoneNumber"
                className="shadow-md "
                placeholder={
                  lang == "en" ? English.enterphone : Hindi.enterphone
                }
              />
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => handleChange(e)}
                value={inputdata.hospital}
                name="hospital"
                className="shadow-md "
                placeholder={
                  lang == "en" ? English.enterhospital : Hindi.enterhospital
                }
              />
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => handleChange(e)}
                value={inputdata.bloodgroup}
                name="bloodgroup"
                className="shadow-md "
                placeholder={
                  lang == "en" ? English.enterbloodgrp : Hindi.enterbloodgrp
                }
              />
            </div>
            <div style={{ fontSize: "small", color: "rgb(162, 6, 6)" }}>
              <input
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                }}
                type="checkbox"
                onChange={(e) =>
                  setinputdata({ ...inputdata, acceptterm: e.target.checked })
                }
                // value={inputdata.acceptterm}
                name="acceptterm"
                id="acceptterm"
                className="shadow-md "
              />{" "}
              <label htmlFor="acceptterm">
                {" "}
                Agree this information for marketing outreach.
              </label>
            </div>
            <button
              className={`${styles1.submitbtnblood} shadow-md`}
              onClick={() => {
                handleSubmit();
              }}
            >
              {lang == "en" ? English.submit : Hindi.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodRequest;

import { useRouter } from "next/router";
import React from "react";
import styles1 from "../../styles/booktest.module.css";
import styles from "../../styles/newchat.module.css";
import English from "../../public/locales/en/labtest";
import Hindi from "../../public/locales/hi/labtest";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Bloodrecieve = () => {
  const [inputdata, setinputdata] = useState({
    name: "",
    phoneNumber: "",
    age: "",
  });
  const [reqData, setreqData] = useState();
  const { lang } = useContext(AccountContext);
  useEffect(() => {
    if (router.query.reqid) {
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/getbloodreq/${router.query.reqid}`;
      console.log(url);
      try {
        axios
          .post(url)
          .then((data) => {
            console.log(data);
            if (data.data) {
              setreqData(data.data.requestitem);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error, "Err");
      }
    }
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    e.preventDefault();
    setinputdata({ ...inputdata, [e.target.name]: e.target.value });
  };
  const router = useRouter();
  // return <div>{router.query.reqid}</div>;
  const handleSubmit = async () => {
    const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/bloodreq/respond/${router.query.reqid}`;
    console.log(inputdata);
    try {
      const UserData = JSON.parse(localStorage.getItem("labuser"));
      axios
        .post(
          url,
          { ...inputdata },
          {
            headers: {
              "x-auth-token": localStorage.usertoken,
            },
          }
        )
        .then((data) => {
          console.log(data);
          if (data.data.id) {
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

  function formatDate(inputDate) {
    const dateParts = inputDate.split("T")[0].split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `${day}/${month}/${year}`;
  }
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
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                {lang == "en" ? English.respondblood : Hindi.respondblood}
              </h1>
            </div>
            {reqData && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "-20px",
                  fontSize: "14px",
                }}
              >
                <p>Blood Group Needed - {reqData.bloodgroup}</p>
                <p>Location - {reqData.hospital}</p>
                <p>Contact Number - {reqData.phoneNumber}</p>
                <p>Requested Date - {formatDate(reqData.createdAt)}</p>
              </div>
            )}
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
                type="number"
                onChange={(e) => handleChange(e)}
                value={inputdata.age}
                name="age"
                className="shadow-md "
                placeholder={lang == "en" ? English.enterage : Hindi.enterage}
              />
            </div>
            {/* <div style={{ fontSize: "small", color: "rgb(162, 6, 6)" }}>
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
            </div> */}
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

export default Bloodrecieve;

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
import { searchApi } from "../../routes/search";
import { notify, sendnotification } from "../../routes/notify";
import Image from "next/image";

const Bloodrecieve = () => {
  const [inputdata, setinputdata] = useState({
    name: "",
    phoneNumber: "",
    age: "",
  });
  const [reqData, setreqData] = useState();
  const { lang } = useContext(AccountContext);
  const router = useRouter();
  const [donaterequest, setdonaterequest] = useState(false);
  useEffect(() => {
    console.log("requestdata", router.query.reqid);
    if (router.query.reqid) {
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/getbloodreq/${router.query.reqid}`;
      console.log(url);
      try {
        axios
          .post(url)
          .then((data) => {
            if (data.data) {
              setreqData(data.data.requestitem);

              console.log("requestdata", data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error, "Err");
      }
    }
  }, [router]);

  const handleChange = (e) => {
    console.log(e.target.value);
    e.preventDefault();
    setinputdata({ ...inputdata, [e.target.name]: e.target.value });
  };
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
          getreqsterData(reqData.userID);
          setdonaterequest(true);
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

  const getreqsterData = async (Email) => {
    console.log("requesterdata13");

    let requesterdata = await searchApi(Email);
    if (requesterdata.data) {
      await notify({
        auth: requesterdata.data[0].auth,
        endpoint: requesterdata.data[0].endpoint,
        p256dh: requesterdata.data[0].p256dh,
        sender: inputdata.name,
        message: `${inputdata.name} wants to  donate blood`,
      });
      await sendnotification({
        title: `${inputdata.name} ने स्वीकार किया आपका रक्तदान अनुरोध!`,
        body: "आयुम हमेशा आपके साथ है",
        click_action: "https://ayum.in/Other/BloodRequest?tab=1",
        icon: "https://ayum.in/icons/icon-96x96.png",
        to: requesterdata.data[0].FCMtoken,
      });
    }
  };

  return (
    <div className={`${styles.chatpage}`} id="chatpage">
      <div id="component1" className={styles1.reportcontainer}>
        {donaterequest ? (
          <div className={`${styles1.reportshell} shadow-xl`}>
            <Image src={"/success.svg"} width={45} height={45} alt="Sucess" />
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              {lang == "en" ? English.reqrecieved : Hindi.reqrecieved} ❤
            </div>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => router.push("/")}
            >
              <Image
                src={"/ayumTranparent.png"}
                width={100}
                height={30}
                alt="Ayum"
              />
            </div>
          </div>
        ) : (
          <div className={`${styles1.reportshell} shadow-xl`}>
            <div className={`${styles1.reportform} `}>
              <div
                style={{
                  display: "block",
                }}
              >
                <h1
                  style={{
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
                  <p>Requested by - {reqData.name}</p>
                  <p>Blood Group Needed - {reqData.bloodgroup}</p>
                  <p>Hospital - {reqData.hospital}</p>
                  <p>Patient Name - {reqData.patientname}</p>
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
                  placeholder={
                    lang == "en" ? English.entername : Hindi.entername
                  }
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
                className={`${styles1.submitbtn} shadow-md`}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {lang == "en" ? English.submit : Hindi.submit}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bloodrecieve;

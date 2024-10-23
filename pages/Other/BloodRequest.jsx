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
import Image from "next/image";
import { WhatsappShareButton, WhatsappIcon } from "next-share";
import { setmessage } from "../../routes/message";
import { getuserId, setConversation } from "../../routes/user";
import { getCookie } from "../../public/utils/Utils";
// import { getCookie } from "../utils/Utils";

const BloodRequest = () => {
  const [tab, settab] = useState(0);

  const router = useRouter();
  useEffect(() => {
    if (router.query.tab == 1) {
      settab(1);
    }
  }, []);
  useEffect(() => {
    if (!localStorage.usertoken || !localStorage.labuser) {
      router.push("/User/UserRegistrationPage");
    }

    if (tab == 1) {
      fetchMyRequests();
    }

    return;
  }, [tab]);

  const { lang, account } = useContext(AccountContext);
  const [requestsent, setrequestsent] = useState(false);
  const [inputdata, setinputdata] = useState({
    name: "",
    phoneNumber: "",
    hospital: "",
    bloodgroup: "",
    acceptterm: false,
    patientname: "",
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
            // let forwardurl = `/Other/Bloodrecieve?reqid=${data.data.id}`;
            // router.push(forwardurl);
            setrequestsent(true);
            sendtextmsg(data.data.id);
            setTimeout(() => {
              settab(1);
            }, 8000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error, "Err");
    }
  };
  const [myrequests, setmyrequests] = useState();

  const fetchMyRequests = async () => {
    const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/mybloodreq`;
    try {
      const UserData = JSON.parse(localStorage.getItem("labuser"));
      const token = await getCookie("usertoken");
      axios
        .post(
          url,
          { ...inputdata, userID: UserData?.email },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setmyrequests(res.data?.data.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error, "Err");
    }
  };
  const [inputactive, setinputactive] = useState(0);

  function formatDate(inputDate) {
    const dateParts = inputDate.split("T")[0].split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `${day}/${month}/${year}`;
  }

  const copyUrlToClipboard = (copyurl) => {
    navigator.clipboard.writeText(copyurl).then(
      () => {
        alert("Your Sharing Url is Copied to Clipboard ");
      },
      () => {
        console.error("Unable to copy to clipboard. Please try again.");
      }
    );
  };

  async function sendtextmsg(reqId) {
    console.log(inputdata);
    await setConversation(
      JSON.parse(localStorage.getItem("labuser")).sub,
      "115971436675659419788"
    );
    let data = await getuserId(
      JSON.parse(localStorage.getItem("labuser")).sub,
      "115971436675659419788"
    );
    console.log(
      "message",
      data,
      account,
      JSON.parse(localStorage.getItem("labuser")).sub
    );

    let msg = {};
    msg = {
      conversationId: data.data._id,
      senderId: JSON.parse(localStorage.getItem("labuser")).sub,
      reciverId: "115971436675659419788",
      text: `Name : ${inputdata.name} ,  Phone : ${inputdata.phoneNumber} , hospital: ${inputdata.hospital}
              Patient Name : ${inputdata.patientname}, Blood Group : ${inputdata.bloodgroup} 
              click the link to save the life : https://ayum.in/Other/Bloodrecieve?reqid=${reqId}`,
      type: "text",
    };
    await setmessage(msg);
  }

  return (
    <div
      style={{
        padding: "0.5rem 0rem",
      }}
      className={`${styles.chatpage}`}
      id="chatpage"
    >
      <div style={{ marginTop: "-1rem" }} className={`${styles.chatnav}`}>
        <div
          style={{ borderBottom: tab == 0 && "4px solid rgb(1, 207, 207)" }}
          onClick={() => settab(0)}
        >
          Request Form
        </div>
        <div
          style={{ borderBottom: tab == 1 && "4px solid rgb(1, 207, 207)" }}
          onClick={() => settab(1)}
        >
          My Requests
        </div>
      </div>
      {tab == 0 && (
        <div id="component1" className={styles1.reportcontainer}>
          {requestsent ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
              className={`${styles1.reportshell} shadow-xl`}
            >
              <Image
                src={"/success.svg"}
                width={60}
                height={60}
                alt="Success"
              />
              <p
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                Request Initiated Successfully , We will verify & <br /> Share
                this with our Life savers very soon
              </p>
            </div>
          ) : (
            <div
              // style={{ backgroundColor: " rgba(248, 157, 150, 0.15)" }}
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
                      // color: "rgb(162, 6, 6)",
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
                    placeholder={
                      lang == "en" ? English.entername : Hindi.entername
                    }
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e)}
                    value={inputdata.patientname}
                    name="patientname"
                    className="shadow-md "
                    placeholder={
                      lang == "en" ? English.patientname : Hindi.patientname
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
                <div style={{ fontSize: "small" }}>
                  <input
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                    }}
                    type="checkbox"
                    onChange={(e) =>
                      setinputdata({
                        ...inputdata,
                        acceptterm: e.target.checked,
                      })
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
      )}
      {tab == 1 && (
        <div className={`${styles1.myreqcontainer} `}>
          {myrequests && myrequests.length > 0
            ? myrequests.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",

                      fontSize: "14px",
                    }}
                    className={`${styles1.myrequestcard} `}
                  >
                    <p>Blood Group Needed {item.bloodgroup}</p>
                    <p>Patient Name - {item.name}</p>
                    <p>Location - {item.location}</p>
                    <p>Contact Number - {item.phoneNumber}</p>
                    <p>Request Date - {formatDate(item.createdAt)}</p>
                    <div className={`${styles1.shareurlbox} `}>
                      <p>Share Your Request</p>
                      <div className={`${styles1.shareurloptions} `}>
                        <div className={`${styles1.copyurlbox} `}>
                          <span>{`https://ayum.in/Other/Bloodrecieve?reqid=${item._id}`}</span>
                          <span
                            onClick={() => {
                              copyUrlToClipboard(
                                `https://ayum.in/Other/Bloodrecieve?reqid=${item._id}`
                              );
                            }}
                          >
                            Copy Url
                          </span>
                          {/* <span
                          onClick={() =>
                            handleWhatsAppShare(
                              `https://ayum.in/Other/Bloodrecieve?reqid=${item._id}`
                            )
                          }
                        >
                          <Image
                            src={"/whatsapplogo.svg"}
                            width={45}
                            height={45}
                            alt="Share on Whatsapp"
                          />
                        </span> */}
                          <WhatsappShareButton
                            url={`https://ayum.in/Other/Bloodrecieve?reqid=${item._id}`}
                            title={`${item.patientname} Needs Blood at ${item.hospital} Be a Life Saver For Him`}
                            separator="-"
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles1.responsebox} `}>
                      <span>Respones</span>
                      {item.response ? (
                        item.response.map((res) => {
                          return (
                            <div className={`${styles1.responsecard} `}>
                              <div>Name - {res.name}</div>
                              <div>Phone - {res.phoneNumber}</div>
                              <div>Age - {res.age}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "rgb(171, 171, 171)",
                          }}
                          className="text-center  "
                        >
                          No Response Found!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            : myrequests &&
              myrequests.length == 0 && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  No Request Found
                </div>
              )}
        </div>
      )}
    </div>
  );
};

export default BloodRequest;

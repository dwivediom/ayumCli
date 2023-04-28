import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ChatBox from "../components/ChatSection/ChatBox";
import MsgInputSection from "../components/ChatSection/MsgInputSection";
import Allusers from "../components/usersSection/Allusers";
import { AccountContext } from "../context/AccountProvider";
import styles from "../styles/chat.module.css";
import { setmessage } from "../routes/message";
import { getuserId, setConversation } from "../routes/user";

export default function Chatpage() {
  const {
    person,
    msgopened,
    signout,
    setAccount,
    account,
    setmsgchange,
    socket,
  } = useContext(AccountContext);
  useEffect(() => {
    const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
    setAccount(localStoragedata);
  }, []);
  const router = useRouter();
  const [mobile, setmobile] = useState(false);
  useEffect(() => {
    if (!localStorage.usertoken || !localStorage.labuser) {
      router.push("/User/UserRegistrationPage");
    }
    console.log(screen.width, "screen width hai");
    console.log(window.innerWidth, "windows width hai");
    if (window.innerWidth < 970) {
      setmobile(true);
    }

    return;
  }, []);

  const [inputdata, setinputdata] = useState({
    name: "",
    phone: "",
    city: "",
  });
  const [sent, setsent] = useState(false);
  const handleChange = useCallback((e) => {
    e.preventDefault();
    setfilldetail(false);
    setinputdata({ ...inputdata, [e.target.name]: e.target.value });
  });
  const sendmsg = async (e) => {
    e && e.preventDefault();
    try {
      const reciverid = "115971436675659419788";
      const senderId = JSON.parse(localStorage.getItem("labuser")).sub;

      await setConversation(senderId, reciverid);

      let socketmsg = {
        senderId: account.sub,
        reciverId: "115971436675659419788",
        text: `Name : ${inputdata.name} ,  Phone : ${inputdata.phone} , city: ${inputdata.city}`,
        type: "text",
      };
      setmsgchange(socketmsg);
      socket.current.emit("sendMessage", socketmsg);

      let data = await getuserId(account.sub, "115971436675659419788");
      let msg = {};
      console.log(data);

      msg = {
        conversationId: data.data._id,
        senderId: account.sub,
        reciverId: "115971436675659419788",
        text: `Name : ${inputdata.name} ,  Phone : ${inputdata.phone} , city: ${inputdata.city}`,
        type: "text",
      };
      await setmessage(msg);
    } catch (error) {
      console.log("Error Occured", error);
    }

    // let holdinput = input;
    // setinputholder("");
    // setinput(" ");

    // await notify({
    //   auth: person.user.auth,
    //   endpoint: person.user.endpoint,
    //   p256dh: person.user.p256dh,
    //   sender: account.name,
    //   message: holdinput,
    // });
  };
  const [filldetail, setfilldetail] = useState(false);
  const [loading, setloading] = useState(false);

  const SubmitTestForm = async (e) => {
    e.preventDefault();
    setloading(true);
    if (
      inputdata.name.length < 3 ||
      inputdata.phone.length < 10 ||
      inputdata.phone.length > 10
    ) {
      setfilldetail(true);
      setsent(false);
      setloading(false);
      return;
    } else {
      console.log(inputdata);
      await sendmsg();
      setloading(false);
      setsent(!sent);
    }
  };

  return (
    <>
      {!signout && (
        <>
          <div className={`${styles.chatpagecontainer}`}>
            <section id="section1" className={`${styles.testformbox}`}>
              <div className="w-[22rem] py-7 px-4 gap-3  flex flex-col rounded-md">
                <h1 className="text-center font-bold text-lg pt-3">
                  Book Your Test
                </h1>
                <div className="flex items-center">
                  <img
                    className="w-[35px] h-[35px]"
                    src="https://img.icons8.com/pastel-glyph/64/null/name.png"
                  />
                  <input
                    type="text"
                    onChange={(e) => handleChange(e)}
                    name="name"
                    value={inputdata.name}
                    className="rounded-md m-2 border-none shadow-md text-md p-3 w-full"
                    placeholder="Enter Name"
                  />
                </div>
                <div className="flex items-center w-full ">
                  <img
                    className="w-[35px] h-[35px]"
                    src="https://img.icons8.com/ios-filled/50/null/apple-phone.png"
                  />
                  <input
                    type="number"
                    name="phone"
                    value={inputdata.phone}
                    onChange={(e) => handleChange(e)}
                    className="rounded-md m-2 border-none shadow-md p-3 w-full"
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div className="flex items-center w-full ">
                  <img
                    className="w-[35px] h-[35px]"
                    src="https://img.icons8.com/ios-filled/50/4D4D4D/city.png"
                    alt="city"
                  />
                  <input
                    type="text"
                    name="city"
                    value={inputdata.city}
                    onChange={(e) => handleChange(e)}
                    className="rounded-md m-2 border-none shadow-md p-3 w-full"
                    placeholder="Enter Your City"
                  />
                </div>

                {sent ? (
                  <div className={`${styles.submitanimation}`}>
                    <span>Request Sent Successfully </span> <br />
                    <img
                      className="w-[35px] h-[35px]"
                      src="https://img.icons8.com/ios-filled/50/40C057/instagram-check-mark.png"
                      alt="success"
                    />
                  </div>
                ) : (
                  <button
                    style={{
                      background: loading && "white",
                    }}
                    onClick={(e) => SubmitTestForm(e)}
                    className="mt-4 bg-red-400 p-2 rounded font-bold text-white "
                  >
                    {loading ? (
                      <span>
                        <Image
                          src={"/loader.svg"}
                          width={25}
                          height={25}
                          alt={"loader img"}
                        />
                      </span>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                )}

                {filldetail && (
                  <span className="text-sm text-center text-red-500 mt-3">
                    Enter Complete and Valid Details
                  </span>
                )}
              </div>
            </section>
            <section
              id="section2"
              style={{ height: "100vh" }}
              className={`${styles.chatshell}`}
            >
              <div
                style={mobile ? { display: msgopened ? "none" : "flex" } : {}}
                className={`${styles.allusercontainer}`}
              >
                <Allusers mobile={mobile && mobile} />
              </div>

              {person && (
                <div
                  style={
                    mobile ? { display: !msgopened ? "none" : "flex" } : {}
                  }
                  className={`${styles.msgcontainer}`}
                >
                  <div className={`${styles.chatbox}`}>
                    <ChatBox mobile={mobile && mobile} />
                  </div>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}

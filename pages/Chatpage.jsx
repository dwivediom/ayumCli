import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ChatBox from "../components/ChatSection/ChatBox";
import MsgInputSection from "../components/ChatSection/MsgInputSection";
import Allusers from "../components/usersSection/Allusers";
import { AccountContext } from "../context/AccountProvider";
import styles from "../styles/chat.module.css";
import Navbar from "../components/Navbar";

export default function Chatpage() {
  const router = useRouter();
  const { person, msgopened, signout } = useContext(AccountContext);
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

  if (msgopened) {
    console.log("Message open hua");
  } else {
    console.log("message Closed hai");
  }

  return (
    <>
      {!signout && (
        <>
          <Navbar />
          <div className={`${styles.chatpagecontainer}`}>
            <div
              style={mobile ? { display: msgopened ? "none" : "flex" } : {}}
              className={`${styles.allusercontainer}`}
            >
              <Allusers mobile={mobile && mobile} />
            </div>

            {person && (
              <div
                style={mobile ? { display: !msgopened ? "none" : "flex" } : {}}
                className={`${styles.msgcontainer}`}
              >
                <div className={`${styles.chatbox}`}>
                  <ChatBox mobile={mobile && mobile} />
                </div>
                <div>
                  <MsgInputSection />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

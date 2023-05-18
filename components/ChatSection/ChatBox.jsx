import React, { useContext, useEffect, useState, useRef } from "react";
import { AccountContext, Accountontext } from "../../context/AccountProvider";
import { getAllMessages, getOldMessages } from "../../routes/message";
import { getuserId } from "../../routes/user";
import Message from "./Message";
// import styles from "../../styles/chat.module.css";
import styles from "../../styles/newchat.module.css";
import Image from "next/image";
import SendPrivatebtn from "./SendPrivatebtn";
import MsgInputSection from "./MsgInputSection";

const ChatBox = ({ mobile }) => {
  const {
    person,
    account,
    setAccount,
    msgchange,
    socket,
    setmsgopened,
    uplodedmsg,
  } = useContext(AccountContext);
  const [usermessage, setusermessage] = useState([]);
  const [IncommingMessage, setIncommingMessage] = useState();
  const [conversationId, setconversationId] = useState();
  const [loading, setloading] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    if (socket.current) {
      socket.current.emit(
        "addUsers",
        JSON.parse(localStorage.getItem("labuser"))
      );
    }
  }, []);

  useEffect(() => {
    console.log(person, "person is here");
    socket.current.emit("isOnline", person.user.sub);
    socket.current.on("getUsers", (newusers) => {
      console.log(newusers, "All user data");
      console.log(typeof newusers, "All user tyoe");
    });
  }, [person]);

  useEffect(() => {
    setloading(true);
    const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
    setAccount(localStoragedata);
    const showMessage = async () => {
      let data = await getuserId(
        JSON.parse(localStorage.getItem("labuser")).sub,
        person.user.sub
      );

      if (data) {
        console.log(data.data);
        setviewOldmsgbtn(true);
        let allmessage = await getAllMessages(data.data && data.data._id);
        setusermessage(allmessage.data);
        setconversationId(data.data && data.data._id);
        setloading(false);
      }
      console.log(usermessage, "User message ");
    };

    showMessage();
  }, [person]);

  useEffect(() => {
    console.log("scroll log", scrollRef);

    scrollRef.current?.scroll(0, 10000, {
      behavior: "smooth",
    });
  }, [usermessage]);

  useEffect(() => {
    socket.current.on("getMessage", async (data) => {
      console.log("data soket ", data);

      console.log("data ki value ", data);
      let localdata = await JSON.parse(localStorage.getItem("labuser"));

      let localdataperson = await JSON.parse(localStorage.getItem("person"));
      console.log(localdataperson);
      if (data.senderId == localdataperson.user.sub) {
        if (usermessage.length > 0) {
          setusermessage([...usermessage, data]);
        } else {
          setusermessage([data]);
        }
      }
    });
  }, [usermessage]);
  useEffect(() => {
    if (usermessage.length > 0) {
      setusermessage([...usermessage, msgchange]);
    } else {
      setusermessage([msgchange]);
    }
  }, [msgchange]);

  useEffect(() => {
    const handlePopstate = (event) => {
      const stateObj = event.state;
      if (stateObj) {
        const username = stateObj.username;
        console.log(username);
        // set display property of conversation component to 'none'
        setmsgopened(false);
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const [viewoldmsgbtn, setviewOldmsgbtn] = useState(true);
  const [oldload, setoldload] = useState(false);

  const showOldMessage = async () => {
    setoldload(true);
    if (conversationId) {
      const oldMsgdata = await getOldMessages(conversationId);
      console.log("oldmessage data ", oldMsgdata);
      if (oldMsgdata.data.length <= 0) {
        setviewOldmsgbtn(false);
        setoldload(false);
      } else {
        setusermessage([...oldMsgdata.data, ...usermessage]);
        setoldload(false);
      }
    }
  };

  const handlePopstate = (event) => {
    // Listen for the popstate event (triggered by the device's back button)
    // and update the display state based on the stored state
    setmsgopened(false);
    console.log("Hello");
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    window.addEventListener("popstate", handlePopstate);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);
  return (
    <>
      <div className={`${styles.chatheadshell}`}>
        {person.user.picture && (
          <Image
            className={`${styles.chatheadimg}`}
            width={44}
            height={44}
            style={{
              borderRadius: "50%",
            }}
            src={`${person.user.picture}`}
            alt="person pic"
          />
        )}

        <span className="text-lg font-bold">{person.name}</span>
        <SendPrivatebtn />
      </div>

      {loading ? (
        <div
          style={{
            width: "95%",
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={"/loader4.svg"}
            width={40}
            height={40}
            alt={"Loader Img"}
          />
        </div>
      ) : (
        <div className="w-full relative ">
          <div className={`${styles.chatmsgs}`} ref={scrollRef}>
            {viewoldmsgbtn && (
              <button
                className={`${styles.oldmsgbtn}`}
                onClick={() => {
                  !oldload && showOldMessage();
                }}
              >
                {oldload ? (
                  <Image
                    src={"/loader4.svg"}
                    width={20}
                    height={20}
                    alt={"Loader Img"}
                  />
                ) : (
                  " view older messages"
                )}
              </button>
            )}

            {usermessage.length > 0 &&
              usermessage.map((msg) => {
                if (msg) {
                  console.log(msg, "Message ");
                  return (
                    <div key={msg._id}>
                      <Message
                        senderId={msg.senderId}
                        msgval={msg.text && msg.text}
                        time={msg.updatedAt}
                        datatype={msg.type}
                      />
                    </div>
                  );
                }
              })}
          </div>
          <MsgInputSection />
        </div>
      )}
    </>
  );
};

export default React.memo(ChatBox);

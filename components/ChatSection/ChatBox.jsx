import React, { useContext, useEffect, useState, useRef } from "react";
import { AccountContext, Accountontext } from "../../context/AccountProvider";
import { getAllMessages } from "../../routes/message";
import { getuserId } from "../../routes/user";
import Message from "./Message";
import styles from "../../styles/chat.module.css";
import Image from "next/image";
import SendPrivatebtn from "./SendPrivatebtn";

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
      console.log(data && data, "Data hai bhaaiaiai");
      if (data) {
        console.log(data.data);
        let allmessage = await getAllMessages(data.data && data.data._id);
        setusermessage(allmessage.data);
        setloading(false);
      }
      console.log(usermessage, "User message ");
    };

    showMessage();
  }, [person, uplodedmsg]);

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

  return (
    <>
      <div className={`${styles.chathead}`}>
        {person.user.picture && (
          <Image
            className={`${styles.chatheadimg}`}
            width={40}
            height={40}
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
            src={"/loader.svg"}
            width={40}
            height={40}
            alt={"Loader Img"}
          />
        </div>
      ) : (
        <div className={`${styles.chatmsgs}`} ref={scrollRef}>
          {mobile && (
            <button
              className={`${styles.backbtn}`}
              onClick={() => setmsgopened(false)}
            >
              {"\u2190"} Back
            </button>
          )}
          {usermessage.length > 0 &&
            usermessage.map((msg) => {
              if (msg) {
                return (
                  <div key={msg._id}>
                    <Message
                      senderId={msg.senderId}
                      msgval={msg.text && msg.text}
                      time={msg.createdAt}
                      datatype={msg.type}
                    />
                  </div>
                );
              }
            })}
        </div>
      )}
    </>
  );
};

export default ChatBox;

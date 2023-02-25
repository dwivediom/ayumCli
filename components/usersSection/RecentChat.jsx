import Image from "next/image";
import React, { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { setConversation } from "../../routers/user";
import styles from "../../styles/chat.module.css";
const RecentChat = (props) => {
  const { setperson, account, setmsgopened } = useContext(AccountContext);
  console.log(props, "Person Hai Yeh");
  const onclick = async (e) => {
    console.log("accint ", account);
    const reciverid = props.user.sub;
    const senderId = JSON.parse(localStorage.getItem("labuser")).sub;
    setperson(props);

    await setConversation(senderId, reciverid);
  };

  return (
    <>
      <div
        onClick={(e) => {
          props.mobile && setmsgopened(true);
          onclick(e);
        }}
        className={`${styles.usercard}`}
      >
        <div className={`${styles.userimage}`}>
          <Image
            alt="profile pic"
            width={60}
            height={60}
            src={`${props.user.picture}`}
          />
        </div>
        <div className={`${styles.userdetail}`}>
          <span className="text-md font-bold text-black">{props.name}</span>
          <span className="text-sm font-md">{props.user.email}</span>
        </div>
      </div>
    </>
  );
};

export default RecentChat;

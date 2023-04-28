import Image from "next/image";
import React, { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { setConversation } from "../../routes/user";
import styles from "../../styles/chat.module.css";
const User = (props) => {
  const { setperson, account, setmsgopened, setmobilevalue } =
    useContext(AccountContext);
  console.log(props, "Person Hai Yeh");
  const onclick = async (e) => {
    setmsgopened(true);
    // setmobilevalue()
    const username = props.user.name;
    const stateObj = { username };
    window.history.pushState(stateObj, null, null);
    const reciverid = props.user.sub;
    const senderId = JSON.parse(localStorage.getItem("labuser")).sub;
    localStorage.setItem("person", JSON.stringify(props));
    setperson(props);

    await setConversation(senderId, reciverid);
  };
  console.log("pros.user ", props.user.picture);

  return (
    <>
      <div
        onClick={(e) => {
          console.log(props.mobile, "Mobile hai ya nahi");

          // setmsgopened(true);
          onclick(e);
        }}
        className={`${styles.usercard}`}
      >
        <div className={`${styles.userimage}`}>
          <Image
            alt="profile pic"
            width={60}
            height={60}
            src={props.user.picture ? props.user.picture : "/deafaultpro.jpg"}
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

export default User;

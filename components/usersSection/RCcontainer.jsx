import React, { useEffect, useState, useContext } from "react";
import User from "./User";
import { getRecentChat } from "../../routes/user";
// import styles from "../../styles/chat.module.css";
import styles from "../../styles/newchat.module.css";
import Image from "next/image";
import { AccountContext } from "../../context/AccountProvider";
import English from "../../public/locales/en/labtest";
import Hindi from "../../public/locales/hi/labtest";

const RCcontainer = ({ mobile }) => {
  const [alluser, setalluser] = useState(null);
  const [doctormenu, setdoctormenu] = useState(false);
  const [usermenu, setusermenu] = useState(true);
  const [loading, setloading] = useState(false);
  const [admin, setadmin] = useState();
  const { lang } = useContext(AccountContext);
  useEffect(() => {
    setloading(true);
    const users = async () => {
      const localStoragejwt = localStorage.getItem("userjwt");

      let data = await getRecentChat(localStoragejwt);
      console.log("recemt cat ", data);
      const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
      setadmin(localStoragedata);
      console.log(" racent chat data", data);
      setalluser(data);
      setloading(false);
    };
    users();
  }, []);

  console.log(alluser && alluser, "saare user hai yeh");

  return (
    <>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "30vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Image
            src={"/loader4.svg"}
            width={40}
            height={40}
            alt={"loader img"}
          />
          <br />{" "}
          <h2>
            {lang == "en" ? English.loadingchats : Hindi.loadingchats}... 💘
          </h2>
        </div>
      ) : (
        <div className={`${styles.usercontainer}`}>
          {usermenu &&
            alluser &&
            alluser.data.map((user) => {
              if (user.sub != admin.sub) {
                return (
                  <User
                    mobile={mobile}
                    key={user.email}
                    name={user.name}
                    user={user}
                  />
                );
              }
            })}
        </div>
      )}
    </>
  );
};

export default React.memo(RCcontainer);

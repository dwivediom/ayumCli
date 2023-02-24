import React, { useEffect, useState, useContext } from "react";
import User from "./User";
import { getRecentChat } from "../../routers/user";
import styles from "../../styles/chat.module.css";
import Image from "next/image";

const RCcontainer = ({ mobile }) => {
  const [alluser, setalluser] = useState(null);
  const [doctormenu, setdoctormenu] = useState(false);
  const [usermenu, setusermenu] = useState(true);
  const [loading, setloading] = useState(false);
  const [admin, setadmin] = useState();
  useEffect(() => {
    setloading(true);
    const users = async () => {
      const localStoragejwt = localStorage.getItem("userjwt");

      let data = await getRecentChat(localStoragejwt);
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
          }}
        >
          <Image
            src={"/loader.svg"}
            width={40}
            height={40}
            alt={"loader img"}
          />
        </div>
      ) : (
        <div className=" h-full w-full shadow">
          <div className={`${styles.usercontainer}`}>
            {usermenu &&
              alluser &&
              alluser.data.recentChat.map((user) => {
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
        </div>
      )}
    </>
  );
};

export default RCcontainer;

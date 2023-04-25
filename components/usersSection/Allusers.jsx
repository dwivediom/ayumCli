import React, { useEffect, useState, useContext, useRef } from "react";
import User from "./User";
import { getuser, getRecentChat } from "../../routes/user";
import styles from "../../styles/chat.module.css";
import Image from "next/image";
import RCcontainer from "./RCcontainer";
import Search from "./Search";
import { useRouter } from "next/router";
import { searchApi } from "../../routes/search";
import SignOutbtn from "./SignOutbtn";

const Allusers = React.memo(({ mobile }) => {
  const [alluser, setalluser] = useState(null);
  const [doctormenu, setdoctormenu] = useState(false);
  const [usermenu, setusermenu] = useState(true);
  const [admin, setadmin] = useState();
  const searchRef = useRef(null);
  const [input, setinput] = useState("");
  const [searchdata, setsearchdata] = useState();
  const [threedotmodal, setthreedotmodal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const users = async () => {
      const localStoragejwt = localStorage.getItem("userjwt");
      let data = await getuser();

      const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
      setadmin(localStoragedata);
      console.log(admin && admin);
      setalluser(data);
    };
    users();
  }, []);

  console.log(alluser && alluser, "saare user hai yeh");

  const gotoupdatepage = () => {
    router.push("./updateProfile");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(input);
    if (input != "") {
      const data = await searchApi(input);
      console.log("data", data);
      setsearchdata(data.data);
      setdoctormenu(true);
    }
  };

  return (
    <>
      <div className="  pb-10 w-full  ">
        <div className={`${styles.mainusercontainer}`}>
          {admin && (
            <>
              <div className={`${styles.chatheadshell}  `}>
                <div className={`${styles.chathead1}  `}>
                  <div className={`${styles.chatheaddetail}  `}>
                    <Image
                      // onClick={() => setthreedotmodal(!threedotmodal)}
                      style={{
                        borderRadius: "50%",
                      }}
                      src={admin ? admin.picture : "/deafaultpro.jpg"}
                      width={40}
                      height={38}
                      alt="Profile Pic"
                    />
                    <div>
                      <span> {admin.name}</span>
                      <span className="text-sm text-gray-400">
                        {" "}
                        {admin.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`${styles.useritems}`}>
                  <div
                    style={{
                      borderBottom: usermenu ? "3px solid #111827 " : "none",
                      color: usermenu && "#111827",
                    }}
                    onClick={() => {
                      setusermenu(true);
                      setdoctormenu(false);
                    }}
                  >
                    Chats
                  </div>{" "}
                  <div
                    ref={searchRef}
                    style={{
                      borderBottom: doctormenu ? "3px solid #111827 " : "none",
                      color: doctormenu && "#111827",
                    }}
                    onClick={() => {
                      console.log(" menue clicked ");
                      setusermenu(false);
                      setdoctormenu(true);
                    }}
                  >
                    Search
                  </div>
                </div>

                <div
                  onClick={() => searchRef.current.click()}
                  className={`${styles.chatsearch}`}
                >
                  <form action="#" onSubmit={(e) => handleSearch(e)}>
                    <input
                      type="search"
                      value={input}
                      onChange={(e) => {
                        setinput(e.target.value);
                      }}
                      placeholder="Search User's Email "
                    />
                    <button
                      disabled={input == "" ? true : false}
                      className={`${styles.searchbtn2}`}
                      type="submit"
                      onClick={(e) => handleSearch(e)}
                    >
                      <img
                        style={{
                          width: "25px",
                          height: "25px",
                        }}
                        src="https://img.icons8.com/sf-regular/48/FFFFFF/search.png"
                        alt="search"
                      />
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}

          {doctormenu && <Search searcheddata={searchdata} admin={admin} />}

          {usermenu && <RCcontainer mobile={mobile} />}
        </div>
      </div>
    </>
  );
});
Allusers.displayName = "Allusers";
export default Allusers;

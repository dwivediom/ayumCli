import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [authstatus, setauthstatus] = useState(false);
  const [thankmodal, setthankmodal] = useState(false);
  const [msgopened, setmsgopened] = useState(false);
  const [account, setAccount] = useState();
  const [person, setperson] = useState(null);
  const [ActiveUsers, setActiveUsers] = useState([]);
  const [msgchange, setmsgchange] = useState("");
  const [mobilevalue, setmobilevalue] = useState(false);
  const [uplodedmsg, setuplodedmsg] = useState(true);
  const [msgprivate, setmsgprivate] = useState(false);

  const socket = useRef();
  useEffect(() => {
    socket.current = io("wss://www.chatsocket.ayum.in");
  }, []);

  return (
    <AccountContext.Provider
      value={{
        authstatus,
        setauthstatus,
        thankmodal,
        setthankmodal,
        account,
        setAccount,
        person,
        setperson,
        socket,
        ActiveUsers,
        setActiveUsers,
        msgchange,
        setmsgchange,
        msgopened,
        setmsgopened,
        mobilevalue,
        setmobilevalue,
        uplodedmsg,
        setuplodedmsg,
        msgprivate,
        setmsgprivate,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;

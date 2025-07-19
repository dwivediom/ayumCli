import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [authstatus, setauthstatus] = useState(false);
  const [thankmodal, setthankmodal] = useState(false);
  const [threedotmodal, setthreedotmodal] = useState(false);
  const [msgopened, setmsgopened] = useState(false);
  const [hidebottomnav, sethidebottomnav] = useState(false);
  const [account, setAccount] = useState();
  const [person, setperson] = useState(null);
  const [ActiveUsers, setActiveUsers] = useState([]);
  const [msgchange, setmsgchange] = useState("");
  const [admindialog, setadmindialog] = useState(false);
  const [adminmode, setadminmode] = useState(false);
  const [closingdrawerallowed, setclosingdrawerallowed] = useState(true);
  const [hidenavbar, sethidenavbar] = useState(false);
  const [mobilevalue, setmobilevalue] = useState(false);
  const [uplodedmsg, setuplodedmsg] = useState(true);
  const [msgprivate, setmsgprivate] = useState(false);
  const [signout, setsignout] = useState(false);
  const [collapseopen, setcollapse] = useState(false);
  const [scrollbox, setscrollbox] = useState(true);
  const [langmodal, setlangmodal] = useState(false);
  const [lang, setlang] = useState("en");

  useEffect(() => {
    if (localStorage.getItem("thankmodal") == false) {
      setthankmodal(false);
    }
    if (localStorage.labuser) {
      setsignout(false);
    } else {
      setsignout(true);
    }
  }, []);

  const socket = useRef();
  useEffect(() => {
    socket.current = io("wss://www.chatsocket.ayum.in");
  }, []);

  useEffect(() => {
    const locale = localStorage.getItem("locale");
    const city = localStorage.getItem("city");
    if (locale && city) {
      setlang(locale);
    } else {
      setlangmodal(true);
    }
  }, []);

  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);

  const openDrawer = () => setIsLoginDrawerOpen(true);
  const closeDrawer = () => setIsLoginDrawerOpen(false);
  return (
    <AccountContext.Provider
      value={{
        admindialog,
        adminmode,
        setadmindialog,
        setadminmode,
        signout,
        scrollbox,
        setscrollbox,
        setsignout,
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
        threedotmodal,
        setthreedotmodal,
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
        collapseopen,
        setcollapse,
        lang,
        setlang,
        langmodal,
        setlangmodal,
        isLoginDrawerOpen,
        openDrawer,
        closeDrawer,
        setclosingdrawerallowed,
        closingdrawerallowed,
        hidebottomnav,
        sethidebottomnav,
        hidenavbar,
        sethidenavbar,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;

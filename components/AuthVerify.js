import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef } from "react";
import { AccountContext } from "../context/AccountProvider";

const Authverify = () => {
  const toastref = useRef();
  const router = useRouter();
  const { openDrawer, setclosingdrawerallowed } = useContext(AccountContext);
  useEffect(() => {
    console.log("Rendering Auth verify page");
    const token = localStorage.getItem("usertoken");
    if (!token) {
      toastref.current.show({
        severity: "error",
        summary: "Error",
        detail: "Not Authorized, Please Login!",
        life: 3000,
      });
      //   router.push("/Member/memberLoginPage");
      setclosingdrawerallowed(false);
      openDrawer();
    }
  }, []);
  return (
    <>
      <Toast ref={toastref} />
    </>
  );
};

export default Authverify;

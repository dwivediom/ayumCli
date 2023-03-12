import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AccountContext } from "../../context/AccountProvider";

const SignOutbtn = () => {
  const { setsignout } = useContext(AccountContext);
  const router = useRouter();
  const signOut = () => {
    localStorage.removeItem("labuser");
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userjwt");
    localStorage.setItem("authStatus", false);

    setsignout(true);
    router.push("/");
  };
  return (
    <>
      <div className="text-red-500" onClick={(e) => signOut(e)}>
        Sign Out
      </div>
    </>
  );
};

export default SignOutbtn;

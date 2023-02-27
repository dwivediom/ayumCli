import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AccountContext } from "../../context/AccountProvider";

const SignOutbtn = () => {
  const { setsignout } = useContext(AccountContext);
  const router = useRouter();
  const signOut = () => {
    setsignout(true);
    localStorage.removeItem("labuser");
    localStorage.removeItem("usertoken");

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

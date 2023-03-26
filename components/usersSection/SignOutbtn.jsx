import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AccountContext } from "../../context/AccountProvider";

const SignOutbtn = () => {
  const { setsignout } = useContext(AccountContext);
  const router = useRouter();
  const signOut = () => {
    localStorage.clear();
    setsignout(true);
    router.push("/");
  };
  return (
    <>
      <div className="text-red-500 w-full" onClick={(e) => signOut(e)}>
        Sign Out
      </div>
    </>
  );
};

export default SignOutbtn;

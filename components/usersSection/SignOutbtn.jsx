import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AccountContext } from "../../context/AccountProvider";

const SignOutbtn = ({ text }) => {
  const { setsignout } = useContext(AccountContext);
  const router = useRouter();
  const signOut = () => {
    localStorage.clear();
    setsignout(true);
    router.push("/");
  };
  return (
    <>
      <div
        className="text-orange-500 font-bold w-full"
        onClick={(e) => signOut(e)}
      >
        {text}
      </div>
    </>
  );
};

export default SignOutbtn;

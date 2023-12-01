import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AccountContext } from "../../context/AccountProvider";
import { setCookie } from "../../public/utils/Utils";

const SignOutbtn = ({ text }) => {
  const { setsignout } = useContext(AccountContext);
  const router = useRouter();
  const signOut = () => {
    // localStorage.clear();
    localStorage.removeItem("labuser");
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userjwt");
    setCookie("usertoken", null, 1);
    setsignout(true);
    router.push("/User/UserRegistrationPage");
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

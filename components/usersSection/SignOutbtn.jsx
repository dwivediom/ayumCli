import React from "react";
import { useRouter } from "next/router";

const SignOutbtn = () => {
  const router = useRouter();
  const signOut = () => {
    localStorage.removeItem("labuser");
    router.push("./");
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

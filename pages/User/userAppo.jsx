import React from "react";
import dynamic from "next/dynamic";
import WithAuth from "../../components/Withauth";
const UserAppointments = dynamic(() =>
  import("../../components/UserProfile/UserAppointments")
);

const userAppo = () => {
  return <UserAppointments />;
};

export default WithAuth(userAppo);

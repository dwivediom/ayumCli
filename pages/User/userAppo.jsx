import React from "react";
import dynamic from "next/dynamic";
const UserAppointments = dynamic(() =>
  import("../../components/UserProfile/UserAppointments")
);

const userAppo = () => {
  return <UserAppointments />;
};

export default userAppo;

import React from "react";
import dynamic from "next/dynamic";
import WithAuth1 from "../../components/WithAuth1";
const UserAppointments = dynamic(() =>
  import("../../components/UserProfile/UserAppointments")
);

const userAppo = () => {
  return <UserAppointments />;
};

export default WithAuth1(userAppo);

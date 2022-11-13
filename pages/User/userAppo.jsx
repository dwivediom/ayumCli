import React from "react";
import dynamic from "next/dynamic";
const UserAppointments = dynamic(() =>
  import("../../components/UserProfile/UserAppointments")
);

const userAppo = () => {
  return (
    <div className="p-1">
      <UserAppointments />
    </div>
  );
};

export default userAppo;

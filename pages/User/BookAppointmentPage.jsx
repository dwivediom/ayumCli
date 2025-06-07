import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import WithAuth1 from "../../components/WithAuth1";
const BookAppointment = dynamic(
  import("../../components/UserProfile/BookAppointment")
);

const BookAppointmentPage = () => {
  const router = useRouter();

  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    setscrollbox(false);
  }, []);

  return <>{<BookAppointment />}</>;
};

export default WithAuth1(BookAppointmentPage);

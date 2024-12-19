import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
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

export default BookAppointmentPage;

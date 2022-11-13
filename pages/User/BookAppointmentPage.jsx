import dynamic from "next/dynamic";
import React from "react";
const BookAppointment = dynamic(
  import("../../components/UserProfile/BookAppointment")
);

const BookAppointmentPage = () => {
  return (
    <>
      <BookAppointment />
    </>
  );
};

export default BookAppointmentPage;

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
  const [data, setData] = useState();

  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    setscrollbox(false);
  }, []);

  useEffect(() => {
    if (typeof router.query.data == "string") {
      console.log("query data");
      const parsedData = JSON.parse(router.query.data);
      console.log(parsedData, "parsed data");
      if (typeof parsedData === "object") {
        setData(parsedData);
      }
    } else {
      router.push("/");
    }

    console.log(data && data);
  }, []);

  return <>{data && <BookAppointment reqdata={data} />}</>;
};

export default BookAppointmentPage;

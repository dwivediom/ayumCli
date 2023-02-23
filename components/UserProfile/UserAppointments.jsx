import React from "react";
import Appointment from "./Appointment";
import styles from "../../styles/UserAppo.module.css";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const UserAppointments = () => {
  const router = useRouter();

  const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/getuser`;
  const [appointment, setappointment] = useState("");
  useEffect(() => {
    axios
      .get(url, {
        headers: {
          "x-auth-token": localStorage.usertoken,
        },
      })
      .then((data) => {
        setappointment(data);
      })
      .catch((err) => console.log(err.message));

    if (!localStorage.usertoken) {
      router.push("/User/UserRegistrationPage");
      console.log("its not worikng ");
    }
  }, []);

  console.log("patitent ", appointment && appointment);

  return (
    <>
      <div className={`${styles.userappocontainer}`}>
        <h1>Your Appointments</h1>
        <div className={`${styles.userapposhell}`}>
          {appointment.data ? (
            appointment.data.appointment.map((data) => {
              return (
                <>
                  <div key={data._id}>
                    <Appointment key={data._id} data={data} />
                  </div>
                </>
              );
            })
          ) : (
            <div className="mt-9">You Have No Appointments</div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserAppointments;

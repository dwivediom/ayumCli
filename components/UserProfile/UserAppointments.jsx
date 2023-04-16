import React from "react";
import Appointment from "./Appointment";
import styles from "../../styles/UserAppo.module.css";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const UserAppointments = () => {
  const router = useRouter();

  const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/getuser`;
  const [appointment, setappointment] = useState("");
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setloading(true);

    axios
      .get(url, {
        headers: {
          "x-auth-token": localStorage.usertoken,
        },
      })
      .then((data) => {
        setappointment(data);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
        router.push("/User/UserRegistrationPage");
      });

    if (!localStorage.usertoken) {
      router.push("/User/UserRegistrationPage");
      console.log("its not worikng ");
    }
  }, []);

  console.log("patitent ", appointment && appointment);

  return (
    <>
      <div className={`${styles.userappocontainer}`}>
        <h1 className="font-bold">Your Appointments</h1>
        <div className={`${styles.userapposhell}`}>
          {loading ? (
            <div
              style={{
                width: "100vw",
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={"/loader.svg"}
                width={40}
                height={40}
                alt="Loading..."
              />
            </div>
          ) : (
            appointment.data &&
            appointment.data.appointment.map((data) => {
              const appointmentDate = new Date(`${data.date}`);
              const today = new Date();
              appointmentDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);

              return (
                <>
                  <div key={data._id}>
                    <div>{appointmentDate.getTime() < today.getTime()}</div>
                    <Appointment key={data._id} data={data} />
                  </div>
                </>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default UserAppointments;

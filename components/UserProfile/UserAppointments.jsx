import React, { useContext, useRef } from "react";
import Appointment from "./Appointment";
import styles from "../../styles/UserAppo.module.css";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AccountContext } from "../../context/AccountProvider";
import { Toast } from "primereact/toast";

const UserAppointments = () => {
  const router = useRouter();

  const [appointment, setappointment] = useState("");
  const [loading, setloading] = useState(false);
  const Getuserappointments = async () => {
    try {
      setloading(true);
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/userappos`;
      axios
        .get(url, {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        })
        .then((data) => {
          console.log(data, "userappos");
          setappointment(data.data?.data);
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
          // router.push("/User/UserRegistrationPage");
        });
    } catch (error) {}
  };

  const toast = useRef();
  useEffect(() => {
    Getuserappointments();
  }, []);

  return (
    <>
      <div id="userappocontainer" className={`${styles.userappocontainer}`}>
        <Toast ref={toast} />
        <h3 style={{ textAlign: "center", color: "var(--teal-500)" }}>
          My Appointments
        </h3>
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
            appointment &&
            appointment.map((data) => {
              const appointmentDate = new Date(`${data?.start_time}`);
              const today = new Date();
              appointmentDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);

              const timeDiffInMs = today.getTime() - appointmentDate.getTime();
              const timeDiffInDays = timeDiffInMs / (1000 * 60 * 60 * 24);

              return (
                <>
                  <div key={data._id}>
                    {/* <div>{appointmentDate.getTime() < today.getTime()}</div> */}
                    <Appointment
                      key={data._id}
                      data={data}
                      timeDiffInDays={timeDiffInDays}
                    />
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

import React, { useEffect, useRef, useState } from "react";
import styles from "./userprofile.module.css";
import Image from "next/image";
import axios from "axios";
import Appointment from "./UserProfile/Appointment";
import { convertDateToDDMMMYYYY } from "../public/utils/Utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const UserProfile = () => {
  const [appointment, setappointment] = useState("");
  const [profilepayload, setprofilepayload] = useState({});
  const [loading, setloading] = useState(false);
  const Getuserappointments = async () => {
    try {
      setloading(true);
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/https://REMOVED`;
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
  const [prescriptions, setprescriptions] = useState();
  const [prescriptionloading, setprescriptionloading] = useState(false);
  const Getuserprescriptions = async () => {
    try {
      setprescriptionloading(true);
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/getuserprescription`;
      axios
        .get(url, {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        })
        .then((data) => {
          console.log(data, "userappos");
          setprescriptions(data.data?.data);
          setprescriptionloading(false);
        })
        .catch((err) => {
          console.log(err);
          setprescriptionloading(false);
        });
    } catch (error) {}
  };
  const [userdata, setuserdata] = useState();
  const GetuserData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/getuser`;
      axios
        .get(url, {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        })
        .then((data) => {
          console.log(data, "userappos");
          setuserdata(data?.data);
          setprofilepayload(data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };

  const toast = useRef();
  useEffect(() => {
    Getuserappointments();
    Getuserprescriptions();
    GetuserData();
  }, []);
  const [updateload, setupdateload] = useState(false);
  const updateuser = async () => {
    setupdateload(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_B_PORT}/api/user/update`;
      const result = await axios.post(url, profilepayload, {
        headers: {
          "x-auth-token": localStorage.usertoken,
        },
      });
      if (!result.data.error) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Profile Saved Successfully",
          life: 3000,
        });
        setupdateload(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong!",
          life: 3000,
        });
        setupdateload(false);
      }
    } catch (error) {}
  };

  return (
    <div className={styles.mainbox}>
      <Toast ref={toast} />
      <div
        style={{ paddingBottom: "1rem" }}
        className={`${styles.profilebox} shadow-md`}
      >
        <div style={{ display: "flex", padding: "1rem", gap: "1rem" }}>
          <div>
            {/* <img
              src={
                userdata?.picture
                  ? userdata?.picture?.replace(/=s\d+-c/, "")
                  : "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              }
              style={{ borderRadius: "50%", width: "150px", height: "150px" }}
            /> */}
            {userdata?.picture && (
              <Image
                width={150}
                height={150}
                style={{ borderRadius: "50%" }}
                src={userdata?.picture?.replace(/=s\d+-c/, "")}
              />
            )}
          </div>
          <div
            style={{
              //   border: "2px solid red",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              background: "var(--surface-100)",
              boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
              padding: "1rem",
            }}
            className="shadow-md"
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {userdata?.name}
            </h2>

            <p>
              <span>Age: {userdata?.age ? `${userdata?.age} yrs` : "N/A"}</span>{" "}
              |{" "}
              <span>
                Gender: {userdata?.gender ? `${userdata?.gender} ` : "N/A"}
              </span>
            </p>
            <div
              style={{
                background: "var(--teal-600)",
                color: "white",
                padding: "3px 10px",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              Joined Ayum on{" "}
              {convertDateToDDMMMYYYY(userdata?.date ? userdata?.date : "")}
            </div>
          </div>
        </div>
        <div
          style={{
            width: "95%",
            margin: "auto",
            background: "var(--surface-100)",
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Name</label>
            <InputText
              value={profilepayload.name}
              onChange={(e) => {
                setprofilepayload({ ...profilepayload, name: e.target.value });
              }}
              placeholder="Enter your name"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Age</label>
            <InputNumber
              value={profilepayload.age}
              onChange={(e) => {
                setprofilepayload({ ...profilepayload, age: e.value });
              }}
              placeholder="Enter your age"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Gender</label>
            <Dropdown
              value={profilepayload.gender}
              onChange={(e) => {
                console.log(e.value);
                setprofilepayload({
                  ...profilepayload,
                  gender: e.value,
                });
              }}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
              style={{
                height: "3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "15rem",
              }}
              optionLabel="label"
              placeholder={
                profilepayload.gender ? profilepayload.gender : "Choose Gender"
              }
              className="w-full md:w-14rem"
            />
          </div>
          <Button
            label="Save"
            style={{ height: "3rem" }}
            icon="pi pi-check"
            loading={updateload}
            onClick={() => {
              updateuser();
            }}
          />
        </div>
        <div
          style={{
            width: "95%",
            margin: "auto",
            background: "var(--surface-100)",
            padding: "1rem",
          }}
          className="shadow-md"
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "teal",
            }}
          >
            My Appointments
          </h2>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "start",
              gap: "1rem",
              overflow: "auto",
            }}
          >
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

                const timeDiffInMs =
                  today.getTime() - appointmentDate.getTime();
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
        <div
          style={{
            width: "95%",
            margin: "auto",
            background: "var(--surface-100)",
            padding: "1rem",
            marginTop: "1rem",
          }}
          className="shadow-md"
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "teal",
            }}
          >
            My Prescriptions
          </h2>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "start",
              gap: "1rem",
            }}
          >
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
              prescriptions &&
              prescriptions.map((data) => {
                return (
                  <>
                    <div
                      className={`${styles.prescriptioncard} shadow-md`}
                      key={data._id}
                    >
                      {data?.medicines?.map((i) => {
                        return (
                          <div
                            style={{
                              background: "var(--teal-100)",
                              padding: "5px",
                            }}
                          >
                            {" "}
                            <span>
                              {i?.typeofmedicine} name - {i.name}
                            </span>{" "}
                            | <span>Duration - {i.duration}</span>
                          </div>
                        );
                      })}
                      Prescibed date - {data?.prescribedAt.slice(0, 10)}
                    </div>
                  </>
                );
              })
            )}
          </div>
        </div>
        <div
          style={{
            width: "95%",
            margin: "auto",
            background: "var(--surface-100)",
            padding: "1rem",
            marginTop: "1rem",
          }}
          className="shadow-md"
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "teal",
            }}
          >
            My Reports
          </h2>
          <p>No Reports Available!</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

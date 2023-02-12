import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "../../styles/Bookappo.module.css";

const BookAppointment = ({ reqdata }) => {
  const docdata = useSelector((state) => state.setdocDataReducer);
  const router = useRouter();
  const [doctordata, setdoctordata] = useState(docdata);
  const [error, seterror] = useState("");
  const [token, settoken] = useState();
  const [response, setresponce] = useState("");
  const [data, setdata] = useState({
    patientname: "",
    age: "",
    description: "",
  });

  useEffect(() => {
    console.log(docdata);
    if (docdata.docdata == null) {
      router.push("/");
      return;
    }

    setdoctordata(docdata.docdata);

    if (localStorage.usertoken) {
      const usertoken = localStorage.getItem("usertoken");
      settoken(usertoken);
    } else {
      router.push("/User/UserRegistrationPage");
    }

    if (!reqdata) {
      router.push("/");
    }
  }, [token, router, docdata]);

  const submit = async (e) => {
    const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/${
      reqdata && reqdata.docid
    }/${reqdata && reqdata.clinicid}`;
    e.preventDefault();
    try {
      let userdata = await axios.post(
        url,
        {
          patientname: data.patientname,
          age: data.age,
          description: data.description,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setresponce(userdata);
      console.log(response);
      if (userdata) {
        router.push("/User/userAppo");
      }
    } catch (err) {
      console.log(err.response);
      if (err.response) {
        seterror(err.response.data.error);
      }
    }
  };

  const handlechange = (e) => {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
  };

  return (
    <div>
      <div>
        <h2 className="m-auto text-center text-cyan-500 font-bold">
          Book Your Appoitnemnt
        </h2>
        <form className={`${styles.bookform}`}>
          <div className="mb-6">
            <label
              htmlFor="patientname"
              className="block mb-2 text-sm font-medium "
            >
              Name of patient
            </label>
            <input
              type="text"
              onChange={(e) => handlechange(e)}
              id="patientname"
              className="  text-black text-sm  w-full  rounded  "
              placeholder="maruti "
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="age" className="block mb-2 text-sm font-medium ">
              {" "}
              Age of patient{" "}
            </label>
            <input
              type="text"
              onChange={(e) => handlechange(e)}
              id="age"
              className="  text-black text-sm  w-full  rounded  "
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className=" block mb-2 text-sm font-medium  "
            >
              {" "}
              Description of problem/disease
            </label>
            <input
              type="text"
              onChange={(e) => handlechange(e)}
              id="description"
              className="  text-black text-sm  w-full p-2.5 rounded  "
              required
            />
          </div>

          <button
            type="submit"
            onClick={(e) => submit(e)}
            className={`${styles.bookformsubmit}`}
          >
            Submit
          </button>
        </form>

        {response.status == 200 ? (
          <h5 className="text-green-500">Booking success!</h5>
        ) : (
          <h5 className="text-red-600 text-bold">
            {error && Array.isArray(error)
              ? error.map((data) => {
                  return `${data.msg}!!`;
                })
              : error}
          </h5>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;

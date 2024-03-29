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
  const [empty, setempty] = useState(true);

  const [loading, setloading] = useState(false);
  const [data, setdata] = useState({
    patientname: "",
    age: "",
    description: "",
    phone: "",
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
    if (data.patientname == "" || data.age == "" || data.phone == "") {
      return setempty(true);
    }
    setloading(true);

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
          phone: data.phone,
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
        setloading(false);
        router.push("/User/userAppo");
      }
    } catch (err) {
      setloading(false);

      router.push("/User/UserRegistrationPage");
    }
  };

  const handlechange = (e) => {
    setempty(false);
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    if (newdata.age > 150 || newdata.phone.length > 10) {
      return;
    }
    setdata(newdata);
  };

  return (
    <div>
      <div>
        <h2 className="m-auto text-center text-cyan-600 font-bold mt-4">
          Book Your Appointment
        </h2>
        <form className={`${styles.bookform} `} action="#">
          <div className="mb-6">
            <label
              htmlFor="patientname"
              className="block mb-2 text-sm font-medium "
            >
              Name of patient <span className="text-red-400">*</span>
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
              Age of patient <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              onChange={(e) => {
                handlechange(e);
              }}
              id="age"
              value={data.age}
              className="   text-black text-sm  w-full  rounded  "
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium ">
              {" "}
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              onChange={(e) => {
                handlechange(e);
              }}
              id="phone"
              value={data.phone}
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

          {empty ? (
            <div className="text-red-500 text-sm mt-3">
              Fill required fields!
            </div>
          ) : loading ? (
            <button
              type="submit"
              // onClick={(e) => submit(e)}
              className={`${styles.bookformsubmit}`}
            >
              Processing...
            </button>
          ) : (
            <button
              type="submit"
              onClick={(e) => submit(e)}
              className={`${styles.bookformsubmit}`}
            >
              Submit{" "}
              <img
                style={{ width: "20px", height: "30px", marginLeft: "5px" }}
                src="/leftside.gif"
                alt="Animated GIF"
              />
            </button>
          )}
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

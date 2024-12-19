import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "../../styles/Bookappo.module.css";
import { getTodayDay } from "../../public/utils/Utils";

const BookAppointment = () => {
  const docdata = useSelector((state) => state.setdocDataReducer);
  const router = useRouter();
  const [doctordata, setdoctordata] = useState(docdata);
  const [error, seterror] = useState("");
  const [token, settoken] = useState();
  const [response, setresponce] = useState("");
  const [empty, setempty] = useState(false);

  const [loading, setloading] = useState(false);
  const [data, setdata] = useState({
    patientname: "",
    age: "",
    description: "",
    phone: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    if (data.patientname == "" || data.age == "" || data.phone == "") {
      return setempty(true);
    }
    setloading(true);

    const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/payandbookappointment`;
    try {
      let userdata = await axios.post(
        url,
        {
          patientname: data.patientname,
          age: data.age,
          phone: data.phone,
          docid: router.query.docid,
          clinicid: router.query.clinicid,
          description: data.description,
          ...selectedSlot,
        },
        {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        }
      );

      setresponce(userdata);
      console.log(response);
      if (userdata) {
        setloading(false);
        console.log(userdata);
        debugger;
        const redirecturl =
          userdata.data?.data?.data.instrumentResponse.redirectInfo.url;

        if (redirecturl) {
          window.location.href = redirecturl;
        }
      }
    } catch (err) {
      setloading(false);

      // router.push("/User/UserRegistrationPage");
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setselectedSlot] = useState({});
  const toast = useRef(null);
  const [reserveddatas, setreserveddatas] = useState([]);
  const [alltimings, setalltimings] = useState();
  const [clinicinfo, setclinicinfo] = useState();
  const [clinicclosed, setclinicclosed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getclinicinfo = async () => {
    try {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_B_PORT}/api/clinic/getclinicbyid?clinicid=${router.query.clinicid}`,
          {
            params: {},
            headers: {},
          }
        )
        .then((data) => {
          setclinicinfo(data.data.data);
          setalltimings(data.data.data.timings);
        })
        .catch((err) => {});
    } catch (error) {}
  };
  useEffect(() => {
    if (router.query.clinicid) getclinicinfo();
  }, [router.query]);
  useEffect(() => {
    async function manageReservedSlots() {
      if (router.query.clinicid) {
        await GetReservedSlots();
      }
    }
    manageReservedSlots();
  }, [router.query, selectedDate]);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const GetReservedSlots = async () => {
    try {
      console.log("Getting reserved slots");
      const newdata = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/reservedslots?clinicid=${router.query.clinicid}&docid=${router.query.docid}`,
        {
          params: {},
          headers: {},
        }
      );
      setreserveddatas(newdata.data?.data);
      console.log("Reserved slots retrieved", newdata.data?.data);
      const finalevents = newdata.data?.data.map((item, indx) => {
        return {
          id: indx,
          title: "Appointment",
          start: new Date(item.start_time),
          end: new Date(item.end_time),
        };
      });
      setevents(finalevents);
    } catch (error) {}
  };

  function filterAvailableSlots(generatedSlots, reservedSlots) {
    return generatedSlots.map((generatedSlot) => {
      const isReserved = reservedSlots?.some((reservedSlot) => {
        // Convert both start and end times to UTC milliseconds for precise comparison
        const generatedStartTime = new Date(
          generatedSlot.startTime
        ).toISOString();
        const generatedEndTime = new Date(generatedSlot.endTime).toISOString();
        const reservedStartTime = new Date(
          reservedSlot.start_time
        ).toISOString();
        const reservedEndTime = new Date(reservedSlot.end_time).toISOString();

        // Check if the times match
        if (
          generatedStartTime === reservedStartTime &&
          generatedEndTime === reservedEndTime
        ) {
          console.log("times match", reservedSlot, generatedStartTime);
        }
        return (
          generatedStartTime === reservedStartTime &&
          generatedEndTime === reservedEndTime
        );
      });

      // Return the slot, marking it as unavailable if there's a match
      return {
        ...generatedSlot,
        available: !isReserved,
      };
    });
  }
  function generateSlotsForDay() {
    let temptiming = alltimings?.find(
      (item) => item.doctorid == router.query.docid
    );
    console.log(temptiming?.timing, "temporarytimevalue");
    if (!temptiming) {
      return;
    }
    let doctorAvailability =
      temptiming &&
      temptiming?.timing.length > 0 &&
      temptiming?.timing?.filter(
        (item) => item?.day == getTodayDay(selectedDate)
      )[0];
    console.log(temptiming.timing, doctorAvailability, "timefilteredhere");
    if (doctorAvailability.closed) {
      setclinicclosed(true);
      return;
    } else {
      setclinicclosed(false);
    }
    doctorAvailability = { ...doctorAvailability, slotDuration: 15 };
    console.log(doctorAvailability, "timefiltered");
    let dateofselected = formatDate(selectedDate);
    const { startTime, endTime, slotDuration } = doctorAvailability;

    const start = new Date(`${dateofselected}T${startTime}:00`);
    const end = new Date(`${dateofselected}T${endTime}:00`);
    const slots = [];

    let current = new Date(start);

    while (current < end) {
      let next = new Date(current.getTime() + slotDuration * 60000);
      slots.push({
        startTime: new Date(current),
        endTime: new Date(next),
        available: true,
      });
      current = next;
    }

    return slots;
  }
  async function getAvailableSlotsForDay(date) {
    console.log("gettingavailableslots");
    const generatedSlots = generateSlotsForDay();
    // const reservedSlots = await getReservedSlots(doctorId, date);
    if (generatedSlots) {
      const availableSlots = filterAvailableSlots(
        generatedSlots,
        reserveddatas
      );
      console.log("Available slots:", availableSlots);
      return availableSlots;
    }
  }
  const [loader, setloader] = useState(false);
  useEffect(() => {
    async function generationofslots() {
      // if (reserveddatas.length > 0) {
      if (alltimings) {
        setloader(true);
        const result = await getAvailableSlotsForDay();
        console.log("generatedSlots end", result);
        setAvailableSlots(result);
        setloader(false);
      }
      // }
    }
    generationofslots();
  }, [reserveddatas, alltimings]);

  return (
    <div>
      <div>
        <h2 className="m-auto text-center text-teal-600 font-bold mt-4">
          Please fill patient details{" "}
        </h2>
        <form className={`${styles.bookform} `} action="#">
          <div>
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

          <div>
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
          <div>
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

          <div>
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
          <div style={{ marginTop: "5px" }}>Select slot</div>
          <div
            style={{
              width: "100%",
              height: "15rem",
              display: "flex",
              overflow: "auto",
              gap: "10px",
              flexWrap: "wrap",
              background: "var(--surface-100)",
              justifyContent: "center",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "8px",
            }}
          >
            {availableSlots?.map((slot, index) => {
              return (
                <div
                  style={{
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                    borderRadius: "7px",
                    border:
                      selectedSlot &&
                      selectedSlot.index == index &&
                      "2px solid var(--teal-600)",
                    cursor: "pointer",
                    width: "7rem",
                    height: "fit-content",
                    padding: "5px",
                    textAlign: "center",
                    color: !slot.available && "white",
                    background: !slot.available ? "var(--teal-600)" : "white",
                  }}
                  onClick={() => {
                    if (slot.available) {
                      setselectedSlot({ ...slot, index: index });
                      console.log(slot);
                    } else {
                      // toast.current.show({
                      //   severity: "error",
                      //   summary: "Error",
                      //   detail: "Slot is already booked!",
                      //   life: 3000,
                      // });
                    }
                  }}
                >
                  <div>
                    {" "}
                    {slot.startTime?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>{" "}
                  -
                  <div>
                    {" "}
                    {slot.endTime?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              paddingTop: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {empty ? (
              <div className="text-red-500 ">Fill required fields!</div>
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
                style={{
                  display: "flex",
                  background: "teal",
                  alignItems: "center",
                  padding: "0px 10px",
                  color: "white",
                  borderRadius: "4px",
                }}
              >
                Submit{" "}
                <img
                  style={{ width: "20px", height: "30px", marginLeft: "5px" }}
                  src="/leftside.gif"
                  alt="Animated GIF"
                />
              </button>
            )}
          </div>
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

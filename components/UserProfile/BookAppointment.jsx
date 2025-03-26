import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "../../styles/Bookappo.module.css";
import { getTodayDay } from "../../public/utils/Utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Toast } from "primereact/toast";

import { Chip } from "primereact/chip";

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

  const [symptoms, setsymptoms] = useState([]);
  const [symptomsdata, setsymptomsdata] = useState([]);
  const GetsymptomsData = async () => {
    try {
      const result = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_B_PORT}/api/getsymptoms?docid=${router.query.docid}`,
      });
      let finaldata = Object.keys(result.data.data[0]?.symptoms);
      setsymptomsdata(result.data.data[0]);
      setsymptoms(finaldata);
      console.log(finaldata, "symptomsresult");
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (data.patientname == "" || data.age == "" || data.phone == "") {
      toastref.current.show({
        severity: "error",
        summary: "Error",
        detail: "Fill required details!",
        life: 3000,
      });
      return;
    }
    console.log(data);
    if (data.phone != "" && data.phone.toString().length != 10) {
      toastref.current.show({
        severity: "error",
        summary: "Error",
        detail: "Phone number should be 10 digits",
        life: 3000,
      });
      return;
    }
    setloading(true);

    console.log(data, "formdatahere");
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
          symptoms: symptomsvalue,
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
  const toastref = useRef();
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
        await GetsymptomsData();
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
    if (doctorAvailability?.closed) {
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
    let slotno = 1;
    while (current < end) {
      let next = new Date(current.getTime() + slotDuration * 60000);
      slots.push({
        startTime: new Date(current),
        endTime: new Date(next),
        slotno: slotno,
        available: true,
      });

      current = next;
      slotno++;
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
  const [symptomsvalue, setsymptomsvalue] = useState([]);

  return (
    <div>
      <div>
        <Toast ref={toastref} />
        <form className={`${styles.bookform} `} action="#">
          <label
            style={{
              marginBottom: "10px",
              color: "var(--teal-600)",
              textAlign: "center",
            }}
          >
            Fill Patient Details
          </label>
          <div>
            <label
              htmlFor="patientname"
              className="block mb-2 text-sm font-medium "
            >
              Name of patient <span className="text-red-400">*</span>
            </label>
            <InputText
              onChange={(e) => {
                setdata({ ...data, patientname: e.target.value });
              }}
              required
              style={{ width: "100%" }}
              placeholder="Patient Name"
              id="patientname"
              value={data.patientname}
            />
          </div>

          <div>
            <label htmlFor="age" className="block mb-2 text-sm font-medium ">
              {" "}
              Age of patient <span className="text-red-400">*</span>
            </label>
            {/* <InputNumber
              onChange={(e) => {
                setdata({ ...data, age: e.value });
              }}
              style={{ width: "100%" }}
              value={data.age}
              required
            /> */}
            <InputText
              onChange={(e) => {
                setdata({ ...data, age: e.target.value });
              }}
              type="number"
              style={{ width: "100%" }}
              value={data.age}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium ">
              {" "}
              Phone <span className="text-red-400">*</span>
            </label>
            {/* <InputNumber
              onChange={(e) => {
                setdata({ ...data, phone: e.value });
              }}
              useGrouping={false}
              style={{ width: "100%" }}
              value={data.phone}
              required
            /> */}
            <InputText
              onChange={(e) => {
                setdata({ ...data, phone: e.target.value });
              }}
              type="number"
              value={data.phone}
              required
            />
          </div>
          {/* 
          <div>
            <label
              htmlFor="description"
              className=" block mb-2 text-sm font-medium  "
            >
              {" "}
              Description of problem/disease
            </label>
            <InputText
              onChange={(e) => {
                setdata({ ...data, description: e.target.value });
              }}
              style={{ width: "100%" }}
              value={data.description}
              required
            />
          
          </div> */}
          <div className="flex mb-2 flex-column gap-2">
            <label htmlFor="description">Symptoms</label>

            <Chips
              value={symptomsvalue}
              onChange={(e) => {
                console.log(e.value, "symptomsvalue");
                setsymptomsvalue(e.value);
              }}
              style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
              separator=","
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
            }}
          >
            {symptoms.map((symptom, index) => {
              return (
                <Chip
                  key={index}
                  label={symptom}
                  style={{
                    cursor: "pointer",
                  }}
                  onRemove={() => {
                    let newSymptoms = [...symptomsvalue];
                    newSymptoms.splice(newSymptoms.indexOf(symptom), 1);
                    setsymptomsvalue(newSymptoms);
                  }}
                  onClick={() => {
                    console.log(symptomsdata[symptom]);
                    let newSymptoms = [...symptomsvalue];

                    const uniqcheck = newSymptoms.find(
                      (item) => item == symptom
                    );
                    if (!uniqcheck) {
                      newSymptoms.push(symptom);
                      // setrecentselectsymptom(symptom)
                      let updatedsymptomooption;
                      if (symptomsdata.symptoms[symptom]) {
                        console.log(
                          symptomsdata.symptoms[symptom].child_symptoms,
                          "newotp"
                        );
                        updatedsymptomooption = [
                          ...symptomsdata.symptoms[symptom].child_symptoms,
                          ...symptoms,
                        ];
                      }
                      if (updatedsymptomooption) {
                        setsymptoms(updatedsymptomooption);
                      }
                      setsymptomsvalue(newSymptoms);
                    } else {
                      return;
                    }
                  }}
                  // removable
                />
              );
            })}
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
              padding: "5px",
              background: "var(--surface-100)",
              color: "var(--surface-600)",
              marginTop: "10px",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span> Platform fee</span> <span>₹20</span>
            </div>
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
              <Button label="Processing..." loading={loading} />
            ) : (
              // <button
              //   type="submit"
              //   onClick={(e) => submit(e)}
              //   style={{
              //     display: "flex",
              //     background:
              //       "linear-gradient(120deg , var(--teal-600) , var(--teal-700))",
              //     alignItems: "center",
              //     padding: "5px 10px",
              //     color: "white",
              //     borderRadius: "24px",
              //   }}
              //   className="shadow-md"
              // >
              //   Pay ₹20 to Book Appointment
              //   <img
              //     style={{ width: "20px", height: "30px", marginLeft: "5px" }}
              //     src="/leftside.gif"
              //     alt="Animated GIF"
              //   />
              // </button>
              <Button
                label="Pay ₹20 to Book Appointment"
                icon="pi pi-check-circle"
                onClick={(e) => submit(e)}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;

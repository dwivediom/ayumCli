import React, { useContext } from "react";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
// import { convertDateToDDMMMYYYY } from "../utils/indexdb";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { AccountContext } from "../context/AccountProvider";
import {
  convertDateToDDMMMYYYY,
  convertToReadableDateTime,
} from "../public/utils/Utils";

const PrescriptionPreview = () => {
  const prescriptionRef = useRef(null);

  const handleDownloadPDF = async () => {
    const element = prescriptionRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("prescription.pdf");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Prescription",
          text: "Check out this prescription from Ayum!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  //   prescription functions

  const [medproducts, setmedproducts] = useState([]);
  const [vitals, setvitals] = useState({});
  const [appointmentdata, setappointmentdata] = useState();
  const [diagnosis, setdiagnosis] = useState([]);

  const intakeBodyTemplate = (product) => {
    return (
      <p style={{ fontWeight: "bold" }}>
        {product.tobetaken == "afterfood"
          ? "After Food"
          : product.tobetaken == "beforefood"
          ? "Before Food"
          : ""}
      </p>
    );
  };

  const dosageBodyTemplate = (product) => {
    return (
      <div>
        {product.dosage && product.dosage} in{" "}
        {product.tod &&
          product.tod.map((x, index) => {
            if (index == product.tod.length - 1) {
              return `${x}.`;
            } else {
              return `${x} and `;
            }
          })}
      </div>
    );
  };

  const [prescdata, setprescdata] = useState();
  const getprescriptiondata = async () => {
    try {
      console.log("fromprescibemodel");

      const prescribedata = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/getprescription?appointmentid=${appointmentdata._id}`
      );
      const finaldata = prescribedata?.data.data[0];
      console.log(finaldata, "Prescription id");
      setprescdata(finaldata);
      setmedproducts(finaldata?.medicines);
      setvitals(finaldata?.vitals ? finaldata?.vitals : {});
      setdiagnosis(finaldata?.diagnosis ? finaldata?.diagnosis : []);
    } catch (error) {}
  };

  const footer = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{`In total there are ${
        medproducts ? medproducts.length : 0
      } medicines`}</span>{" "}
    </div>
  );

  const [doctordata, setdoctordata] = useState();
  const [clinicdata, setclinicdata] = useState();
  // useEffect(() => {
  //   const tempdocdata = JSON.parse(localStorage.getItem("DocData"));
  //   const tempclinicdata = JSON.parse(
  //     localStorage.getItem("selectedclinicdata")
  //   );
  //   setdoctordata(tempdocdata);
  //   setclinicdata(tempclinicdata);
  // }, []);

  const [loading, setloading] = useState(false);

  const router = useRouter();
  const GetAppointmentdata = async () => {
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/getuserclinicappo?id=${router.query.ap}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        }
      );

      console.log(result, "appointment data");
      setappointmentdata(result?.data?.data?.appointment);
      setdoctordata(result?.data?.data?.doctordata);
      setclinicdata(result?.data?.data?.clinicdata);
    } catch (error) {}
  };
  useEffect(() => {
    if (router.query.ap) {
      GetAppointmentdata();
    }
  }, [router.query]);

  useEffect(() => {
    console.log(appointmentdata, "appointmentdata changed");

    if (appointmentdata?.prescribed) {
      getprescriptiondata();
    }
  }, [appointmentdata]);
  const toast = useRef();
  const [tests, settests] = useState([]);

  const GetLabTests = () => {
    axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_B_PORT}/api/appointment/getlabtests`,
      headers: {
        "x-auth-token": localStorage.doctoken,
      },
      data: {
        appointmentid: labtestpopups,
      },
    })
      .then((res) => {
        console.log(res.data, "Labtestsdatahere");
        settests(res.data.data?.tests ? res.data.data?.tests : []);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="container mx-auto px-4 ">
      <div ref={prescriptionRef} className="border p-4 bg-white shadow-md">
        <div
          style={{
            marginRight: "1rem",
            padding: "1rem",
            // marginLeft: "3.5rem",
            background: "white",
            borderRadius: "12px",
          }}
          className="shadow-xl"
        >
          <Toast ref={toast} position="top-right" />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",

              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0",
                height: "3rem",
                gap: "5px",
                width: "100%",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                {" "}
                Dr. {doctordata?.name}
              </span>{" "}
              <span style={{ fontSize: "14px" }}>
                {doctordata?.specialist?.charAt(0).toUpperCase() +
                  doctordata?.specialist?.slice(
                    1,
                    doctordata?.specialist?.length
                  )}
              </span>
              <span style={{ fontSize: "14px" }}>
                Reg. No. {doctordata?.regno}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image src={"/doctorprologo.png"} width={80} height={100} />
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "column",
                textAlign: "right",
              }}
            >
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "Bold",
                }}
              >
                {" "}
                {clinicdata?.clinicName}
              </span>
              <span>{clinicdata?.location}</span>
              {/* <span>
            Phone - 12121212121 
          </span> */}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                maxWidth: "80%",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                {" "}
                Patient Name - {appointmentdata?.patientname}{" "}
                {appointmentdata?.gender} | Age - {appointmentdata?.age}yrs. |
                Phone - {appointmentdata?.phone}{" "}
              </span>
              <span>
                {" "}
                {appointmentdata?.address &&
                  `Address - ${appointmentdata?.address}`}
              </span>

              <span
                style={{
                  display: "flex",
                  gap: "5px",
                  flexWrap: "wrap",
                  flexDirection: "column",
                  padding: "8px",
                  borderRadius: "4px",
                  background: "var(--surface-100)",
                }}
              >
                <span style={{ color: "var(--purple-700)", fontWeight: "600" }}>
                  Vitals
                </span>
                <span
                  style={{
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  {Object.keys(vitals).length > 0 &&
                    Object.keys(vitals).map((item, idx) => {
                      return (
                        <span
                          style={{
                            background: "var(--purple-100)",
                            color: "black",
                            padding: "5px",
                            borderRadius: "4px",
                          }}
                          key={idx}
                        >
                          {item?.charAt(0).toUpperCase() + item.slice(1)} -{" "}
                          {vitals[item]}{" "}
                        </span>
                      );
                    })}
                </span>

                {/* Weight - 80 , Height {"cm"} 200 , B.M.I - 200 , Bp - 120/80 mmHg */}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>
                Date -{" "}
                {convertDateToDDMMMYYYY(new Date().toISOString()?.slice(0, 10))}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontWeight: "600" }}>Description </span>{" "}
                <span
                  style={{
                    background: "var(--surface-200)",
                    borderRadius: "24px",
                    padding: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "400",
                  }}
                >
                  {appointmentdata?.description}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontWeight: "600", marginBottom: "5px" }}>
                Diagnosis{" "}
              </span>{" "}
              {/* <InputText placeholder="Enter Diagnosis" /> */}
              <div>
                {diagnosis.map((item) => {
                  return (
                    <span
                      style={{
                        fontWeight: "500",
                        padding: "5px 10px",
                        background: "var(--surface-200)",
                        marginRight: "7px",
                        borderRadius: "24px",
                      }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <span style={{ fontWeight: "500", marginTop: "10px" }}>
              {convertToReadableDateTime(prescdata?.prescribedAt || "")}
            </span>
            <DataTable
              value={medproducts}
              footer={footer}
              tableStyle={{ minWidth: "60rem", borderRadius: "12px" }}
            >
              <Column
                field="name"
                header="Medicine Name"
                body={(product, index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {product.name}{" "}
                    </div>
                  );
                }}
              ></Column>
              <Column field="typeofmedicine" header="Type"></Column>

              <Column
                field="dosage"
                header="Dosage"
                body={dosageBodyTemplate}
              ></Column>
              <Column
                field="duration"
                header="Duration"
                body={(product) => {
                  return <div>{product.duration} Days</div>;
                }}
              ></Column>
              <Column field="advice" header="Advice"></Column>
              <Column
                header="Intake"
                field="tobetaken"
                body={intakeBodyTemplate}
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          paddingLeft: "2.5rem",
          background: "white",
        }}
      >
        <Button
          label="Share"
          onClick={handleShare}
          outlined
          severity="info"
          icon="pi pi-share-alt"
        />
        <Button
          onClick={handleDownloadPDF}
          label="Download as PDF"
          icon="pi pi-download"
        />
      </div>
    </div>
  );
};

export default PrescriptionPreview;

import React, { useEffect, useState } from "react";
import styles from "../styles/extracss.module.css";
// import { InputText } from "primereact/inputtext";
// import { InputNumber } from "primereact/inputnumber";
// import { Button } from "primereact/button";
import axios from "axios";
// import { useRouter } from "next";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const checkout = () => {
  const router = useRouter();

  const [payPayload, setpayPayload] = useState({
    name: "",
    phone: "",
    amount: "",
  });
  const handleSubmit = async () => {
    console.log(payPayload, "payPayload");
    axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_B_PORT}/api/doctor/checkoutsubscription`,
      headers: {
        "x-auth-token": router.query.doc,
      },
      data: {
        ...payPayload,
        transactionid: "T" + Date.now(),
        MUIDW: "MUIDW" + Date.now(),
        planid: router.query.plan,
      },
    })
      .then((res) => {
        console.log(res, "success");
        const redirecturl =
          res.data?.data?.data.instrumentResponse.redirectInfo.url;

        if (redirecturl) {
          window.location.href = redirecturl;
        }
      })
      .catch((e) => {
        console.log(e);
        //   toast.current.show({
        //     severity: "error",
        //     summary: "Error",
        //     detail: "Failed to update appointment.",
        //     life: 3000,
        //   });
        //   return false;
      });
  };

  // useEffect(() => {
  //   console.log(router.query, "useeffectrr");

  //   if (router.query?.plan == "3monthplan") {
  //     setpayPayload({ ...payPayload, amount: 799 * 3 });
  //   }
  //   if (router.query?.plan == "6monthplan") {
  //     setpayPayload({ ...payPayload, amount: 799 * 6 });
  //   }
  //   if (router.query?.plan == "1yearplan") {
  //     setpayPayload({ ...payPayload, amount: 699 * 12 });
  //   }
  // }, [router.query]);
  const [planinfo, setplaninfo] = useState();
  const GetPlans = async () => {
    try {
      console.log("gettingplanstart");
      const plandata = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/doctor/getplanbyid?planid=${router.query.plan}`,
        {}
      );
      let finaldata = plandata.data?.data;
      setpayPayload({
        ...payPayload,
        amount: finaldata?.planPricePerMonth * finaldata?.planDurationinMonth,
      });
      setplaninfo(finaldata);
      console.log(plandata, "plandatahere");
    } catch (error) {}
  };
  const [docdata, setdocdata] = useState();

  useEffect(() => {
    if (router.query.plan) {
      GetPlans();
    }
    let doctor = JSON.parse(localStorage.getItem("DocData"));
    setdocdata(doctor);
    setpayPayload({ ...payPayload, name: doctor?.name });
  }, [router.query]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);
  return (
    <div className={styles.checkoutdiv}>
      <div
        style={{
          padding: "2rem 1rem",
          background: "white",
          boxShadow: "0 4px 5px rgba(0,0,0,0.2)",
          borderRadius: "4px",
          gap: "10px",
          width: isMobile ? "100%" : "50%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3>{planinfo?.planName}</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
            background: "var(--surface-100)",
          }}
        >
          <label htmlFor="name">Name</label>
          <div>{payPayload.name}</div>
          {/* <InputText
            disabled
            placeholder="Enter your name"
            value={payPayload.name}
            onChange={(e) => {
              setpayPayload({ ...payPayload, name: e.target.value });
            }}
          /> */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
            background: "var(--surface-100)",
          }}
        >
          <label htmlFor="amount">Amount</label>
          <div>
            {planinfo?.planPricePerMonth} x {planinfo?.planDurationinMonth} = ₹
            {payPayload.amount}
          </div>
          {/* <InputText
            type="number"
            disabled
            value={payPayload.amount && payPayload.amount}
            placeholder="Enter amount"
            onChange={(e) => {
              setpayPayload({ ...payPayload, amount: e.target.value });
            }}
          /> */}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="phone">Phone</label>

          <InputText
            type="number"
            placeholder="Enter your phone"
            style={{ border: "1px solid var(--teal-500)" }}
            onChange={(e) => {
              setpayPayload({ ...payPayload, phone: e.target.value });
            }}
          />
        </div>

        {/* <button
          label="Pay now"
          onClick={() => {
            handleSubmit();
          }}
        /> */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            label="Pay Now"
            style={{ margin: "auto", marginTop: "1rem" }}
            icon="pi pi-check"
            onClick={() => {
              handleSubmit();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default checkout;

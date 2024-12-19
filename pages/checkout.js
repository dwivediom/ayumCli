import React, { useEffect, useState } from "react";
import styles from "../styles/extracss.module.css";
// import { InputText } from "primereact/inputtext";
// import { InputNumber } from "primereact/inputnumber";
// import { Button } from "primereact/button";
import axios from "axios";
// import { useRouter } from "next";
import { useRouter } from "next/router";

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

  useEffect(() => {
    console.log(router.query, "useeffectrr");

    if (router.query?.plan == "3monthplan") {
      setpayPayload({ ...payPayload, amount: 799 * 3 });
    }
    if (router.query?.plan == "6monthplan") {
      setpayPayload({ ...payPayload, amount: 799 * 6 });
    }
    if (router.query?.plan == "1yearplan") {
      setpayPayload({ ...payPayload, amount: 699 * 12 });
    }
  }, [router.query]);
  return (
    <div className={styles.checkoutdiv}>
      <div className={styles.checkoutform}>
        <div className={styles.checkoutformdiv}>
          <label htmlFor="name">Name</label>
          <input
            onChange={(e) => {
              setpayPayload({ ...payPayload, name: e.target.value });
            }}
            placeholder="Enter your name"
          />
        </div>
        <div className={styles.checkoutformdiv}>
          <label htmlFor="phone">Phone</label>
          <input
            type="number"
            onChange={(e) => {
              setpayPayload({ ...payPayload, phone: e.target.value });
            }}
            placeholder="Enter your phone"
          />
        </div>
        <div className={styles.checkoutformdiv}>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            onChange={(e) => {
              setpayPayload({ ...payPayload, amount: e.target.value });
            }}
            // prefix="₹"
            value={payPayload.amount && payPayload.amount}
            placeholder={payPayload.amount}
          />
        </div>
        {/* <button
          label="Pay now"
          onClick={() => {
            handleSubmit();
          }}
        /> */}
        <button
          onClick={() => {
            handleSubmit();
          }}
          className={styles.checkoutsubmit}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default checkout;

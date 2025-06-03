import React, { useEffect, useState } from "react";
import MedicalInvoice from "../../components/medical/MedicalInvoice";
import { useRouter } from "next/router";
import axios from "axios";

const orderdetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setinvoice] = useState(null);

  const GetOrderDetails = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/orderdetails?id=${id}`
    );
    setinvoice(response.data.data);
    console.log(response.data.data, "invoicedata");
  };
  useEffect(() => {
    if (id) {
      GetOrderDetails();
    }
  }, [id]);
  return (
    <div style={{ paddingTop: "10px" }}>
      {invoice && <MedicalInvoice invoice={invoice} showaspage={true} />}
    </div>
  );
};

export default orderdetails;

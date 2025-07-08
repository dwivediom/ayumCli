import React, { useEffect, useState } from "react";
import MedicalInvoice from "../../components/medical/MedicalInvoice";
import { useRouter } from "next/router";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const orderdetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setinvoice] = useState(null);
  const [store, setstore] = useState(null);
  const [showCancelledDialog, setShowCancelledDialog] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const GetOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/orderdetails?id=${id}&store=true`
      );
      
      // Check if order is cancelled
      if (response.data.msg === "This order has been cancelled" && 
          response.data.error === false && 
          response.data.status === "cancelled") {
        setOrderStatus(response.data);
        setShowCancelledDialog(true);
        return;
      }
      
      setinvoice(response.data.data);
      setstore(response.data.store);
      console.log(response.data.data, "invoicedata");
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      GetOrderDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      {invoice && (
        <MedicalInvoice invoice={invoice} showaspage={true} store={store} />
      )}
      
      {/* Cancelled Order Dialog */}
      <Dialog
        visible={showCancelledDialog}
        onHide={() => setShowCancelledDialog(false)}
        header="Order Cancelled"
        style={{ width: '400px' }}
        footer={
          <div className="flex justify-end">
            <Button 
              label="Go Back" 
              icon="pi pi-arrow-left" 
              onClick={handleGoBack}
              className="p-button-secondary"
            />
          </div>
        }
      >
        <div className="text-center">
          <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Order Cancelled</h3>
          <p className="text-gray-600 mb-4">
            This order has been cancelled and the invoice has been deleted.
          </p>
          <p className="text-sm text-gray-500">
            Order ID: {id}
          </p>
        </div>
      </Dialog>
    </div>
  );
};

export default orderdetails;

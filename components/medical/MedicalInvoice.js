import React, { useRef, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/primereact.min.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MedicalInvoice = ({
  invoice,
  showinvoice,
  setshowinvoice,
  showaspage,
  store,
}) => {
  const [storeDetails, setStoreDetails] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    setStoreDetails(store);
  }, []);

  // Transform the invoice data into the required format
  const transformInvoiceData = (invoice) => {
    if (!invoice) return [];

    return invoice.items.map((item) => ({
      item: item?.brandName || item?.genericName || "N/A",
      exp: item?.expiryDate.split("T")[0] || "N/A",
      batch: item?.batchNumber || "N/A",
      hsn: item?.hsn || "N/A",
      qty: item?.quantity || 0,
      mrp: item?.mrp || 0,
      discount: item?.discount || 0,
      total: item?.total?.toFixed(2) || 0,
    }));
  };
  // invoice data
  const invoiceData = transformInvoiceData(invoice);

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const newWindow = window.open("", "", "height=600,width=800");
    newWindow.document.write("<html><head><title>Invoice</title>");
    newWindow.document.write(
      "<style>body{font-family:monospace;}table{width:100%;border-collapse:collapse;}td,th{border:1px solid black;padding:4px;}div{margin-bottom:8px;}</style>"
    );
    newWindow.document.write("</head><body>");
    newWindow.document.write(printContents);
    newWindow.document.write("</body></html>");
    newWindow.document.close();
    newWindow.print();
  };

  const handleDownload = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const getCustomerInfo = () => {
    if (invoice?.medicalorder) {
      return {
        name: invoice.medicalorder?.name || "N/A",
        address: invoice.medicalorder?.address || "N/A",
        phone: invoice.medicalorder?.phone || "N/A",
        gstin: invoice.medicalorder?.gstin || "N/A",
      };
    } else {
      return {
        name: invoice?.customerInfo?.name || "N/A",
        address:
          typeof invoice.customerInfo?.address == "object"
            ? invoice.customerInfo?.address?.street
            : invoice.customerInfo?.address || "N/A",
        phone: invoice?.customerInfo?.phone || "N/A",
        gstin: "N/A",
      };
    }
  };

  const customerInfo = getCustomerInfo();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);
  const invoicecontent = () => {
    return (
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          padding: "10px",
        }}
      >
        <div className="flex justify-end gap-2">
          <Button
            label="Download"
            icon="pi pi-download"
            onClick={handleDownload}
          />
          <Button label="Print" icon="pi pi-print" onClick={handlePrint} />
        </div>
        <div
          ref={invoiceRef}
          style={{
            padding: isMobile ? "1rem" : "2rem",
          }}
          className="max-w-4xl mx-auto border border-black  font-mono"
        >
          <div className="max-w-4xl mx-auto border border-black  font-mono">
            <div className="text-center">
              <h2 className="text-xl font-bold uppercase">
                {storeDetails?.buisnessname || "Medical Store"}
              </h2>
              <p>{storeDetails?.bio || "Store Description"}</p>
              <p>
                Phone No.:{" "}
                {storeDetails?.displayphone || storeDetails?.phone || "N/A"} |
                Email: {storeDetails?.email || "N/A"}
              </p>
              <p>City: {storeDetails?.city || "N/A"}</p>
              {/* {storeDetails?.insurances && storeDetails.insurances.length > 0 && (
            <p>Insurance Accepted: {storeDetails.insurances.join(", ")}</p>
          )} */}
            </div>

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
              className=" text-sm"
            >
              <div>
                <p>
                  <strong>Bill To:</strong> {customerInfo.name}
                </p>
                <p>{customerInfo.address}</p>
                <p>Contact No.: {customerInfo.phone}</p>
                {customerInfo.gstin !== "N/A" && (
                  <p>GSTIN: {customerInfo.gstin}</p>
                )}
                <p>Date: {formatDate(invoice.saleDate)}</p>
              </div>

              <div>
                <p>
                  <strong>Invoice No:</strong> {invoice.saleOrderId}
                </p>
                <p>Place of Supply: {storeDetails?.city || "N/A"}</p>
              </div>
            </div>

            <Divider />

            <DataTable
              value={invoiceData}
              className="text-sm border border-black"
              responsiveLayout="scroll"
              showGridlines
            >
              <Column field="item" header="Item Name"></Column>
              <Column field="exp" header="Exp. Date"></Column>
              <Column field="batch" header="Batch No."></Column>
              <Column field="hsn" header="HSN/SAC"></Column>
              <Column field="qty" header="Qty"></Column>
              <Column
                field="mrp"
                header="MRP"
                body={(rowData) => <span>₹{rowData.mrp}</span>}
              ></Column>
              {invoice.showdiscount && (
                <Column
                  field="discount"
                  header="Discount"
                  body={(rowData) => <span>₹{rowData.discount}</span>}
                ></Column>
              )}
              {/* <Column field="rate" header="Rate/Pack"></Column> */}
              {/* <Column field="cgst" header="CGST"></Column>
          <Column field="sgst" header="SGST"></Column> */}
              <Column
                field="total"
                header="Total"
                body={(rowData) => <span>₹{rowData.total}</span>}
              ></Column>
            </DataTable>

            <Divider />

            <div className="text-right text-sm">
              {/* <p>CGST: ₹{invoice.totalAmount?.cgst || 0}</p>
          <p>SGST: ₹{invoice.totalAmount?.sgst || 0}</p> */}
              <p>
                <strong>Subtotal:</strong> ₹{invoice.totalAmount?.subTotal || 0}
              </p>
              <p>
                <strong>Discount:</strong> ₹{invoice.totalAmount?.discount || 0}
              </p>
              <p className="font-bold text-base">
                Total: ₹{invoice.totalAmount?.netAmount || 0}
              </p>
              <p className="font-bold text-base">
                Paid Amount: ₹{invoice.totalAmount?.paidAmount || 0}
              </p>
              <p className="font-bold text-base">
                Pending Amount: ₹{invoice.totalAmount?.pendingAmount || 0}
              </p>
            </div>

            <Divider />

            <p className="text-sm mt-2">
              <strong>Payment Method:</strong> {invoice.paymentMethod}
            </p>
            <p className="text-sm">
              <strong>Payment Status:</strong> {invoice.paymentStatus}
            </p>

            <Divider />

            <div className="flex justify-between text-sm">
              {/* <div>
            <p>
              <strong>Hospital Type:</strong>{" "}
              {storeDetails?.hospital || "N/A"}
            </p>
            {storeDetails?.facilities &&
              storeDetails.facilities.length > 0 && (
                <p>
                  <strong>Facilities:</strong>{" "}
                  {storeDetails.facilities.join(", ")}
                </p>
              )}
            {storeDetails?.specialties &&
              storeDetails.specialties.length > 0 && (
                <p>
                  <strong>Specialties:</strong>{" "}
                  {storeDetails.specialties.join(", ")}
                </p>
              )}
          </div> */}
              <div>
                <p className="text-right">
                  <strong>
                    {storeDetails?.buisnessname || "Medical Store"}
                  </strong>
                </p>
                <div
                  style={{
                    position: "relative",
                    height: "150px",
                  }}
                >
                  <img
                    src={storeDetails?.signature}
                    alt="logo"
                    className="w-20 h-20"
                    style={{
                      width: "200px",
                      height: "100px",
                      position: "absolute",
                      bottom: "30px",
                      right: "-20px",
                    }}
                  />
                  <p className="text-right mt-10">(Authorized Signatory)</p>
                </div>
              </div>
            </div>

            <Divider />

            <div className="text-sm">
              <p>
                <strong>Terms & Conditions:</strong>
              </p>
              <ol className="list-decimal list-inside">
                <li>Price refundable if overcharged by oversight.</li>
                <li>
                  Subject to {storeDetails?.city || "Store"} Jurisdiction.
                </li>
                <li>
                  Make all cheques payable to{" "}
                  {storeDetails?.buisnessname || "Medical Store"}.
                </li>
                {storeDetails?.insurances &&
                  storeDetails.insurances.length > 0 && (
                    <li>
                      Insurance claims are subject to policy terms and
                      conditions.
                    </li>
                  )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {showaspage ? (
        <div>{invoicecontent()}</div>
      ) : (
        <Dialog
          position="top"
          visible={showinvoice}
          style={{ width: "100%" }}
          onHide={() => setshowinvoice(false)}
          header="Medical Invoice"
        >
          {invoicecontent()}
        </Dialog>
      )}
    </>
  );
};

export default MedicalInvoice;

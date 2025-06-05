import React, { useState, useEffect, useRef } from "react";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import styles from "./styles.module.css";
import { getAuthHeaders } from "../../config/api/labApi";
import PdfViewer from "./PdfViewer";
import { Paginator } from "primereact/paginator";
import { useRouter } from "next/router";

const MedicineRequests = () => {
  const toast = useRef(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  const [filters, setFilters] = useState({
    status: null,
    startDate: null,
    endDate: null,
  });
  const router = useRouter();
  const handleReorder = async (request) => {
    try {
      let checkoutForm = request.deliveryAddress;
      const deliveryAddress = {
        street: checkoutForm.street,
        city: checkoutForm.city,
        state: checkoutForm.state,
        pincode: checkoutForm.pincode,
        landmark: checkoutForm.landmark,
      };
      let cart = request.items;
      const items = cart.map((item) => ({
        medicineId: item._id,
        quantity: item.quantity,
        name: item.brandName,
        price: item.price,
        total: item.price * item.quantity,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const deliveryCharge = 40;
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + deliveryCharge + tax;

      const requestData = {
        pharmacyId: request.pharmacyId?._id,
        orderType: "medicine_search",
        contactNumber: request.contactNumber,
        deliveryAddress,
        payment: {
          method: request.payment?.method,
          amount: {
            subtotal,
            discount: 0,
            deliveryCharge,
            tax,
            total,
          },
        },
        items,
        notes: request.notes,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/create`,
        requestData,
        { headers: getAuthHeaders() }
      );

      if (response.data) {
        toast.current.show({
          severity: "success",
          summary: "Order Reordered",
          detail: "Your medicine request has been reordered successfully!",
          life: 3000,
        });
        setShowReorderConfirmation(false);
        setTimeout(() => {
          router.push("/medical/requests");
        }, 1000);
      }
    } catch (error) {
      console.error("Error reordering medicine request:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to reorder medicine request. Please try again.",
        life: 3000,
      });
    }
  };

  // cancel order api
  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/cancel`,
        { requestId: selectedRequest._id, reason: cancellationReason },
        { headers: getAuthHeaders() }
      );
      if (response.data) {
        toast.current.show({
          severity: "success",
          summary: "Order Cancelled",
          detail: "Your medicine request has been cancelled successfully!",
          life: 3000,
        });
        setShowCancelConfirmation(false);
        setTimeout(() => {
          router.push("/medical/requests");
        }, 1000);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to cancel order. Please try again.",
        life: 3000,
      });
    }
  };

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [enlargedFile, setEnlargedFile] = useState(null);
  const [showEnlargeDialog, setShowEnlargeDialog] = useState(false);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Processing", value: "processing" },
    { label: "Ready for Delivery", value: "ready_for_delivery" },
    { label: "Out for Delivery", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchRequests = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.status) {
        params.append("status", filters.status);
      }

      if (filters.startDate)
        params.append(
          "startDate",
          filters.startDate.toISOString().split("T")[0]
        );
      if (filters.endDate)
        params.append("endDate", filters.endDate.toISOString().split("T")[0]);
      params.append("page", page);
      params.append("limit", limit);

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_B_PORT
        }/api/medical/user/request/list?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.data) {
        setRequests(response.data.requests);
        setTotalRecords(response.data.total);
        setCurrentPage(response.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch medicine requests",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage, rows);
  }, [filters, currentPage, rows]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(Math.floor(event.first / event.rows) + 1);
  };

  const onFilterChange = (newFilters) => {
    setFilters(newFilters);
    setFirst(0);
    setCurrentPage(1);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "pi-clock";
      case "confirmed":
        return "pi-check-circle";
      case "processing":
        return "pi-cog";
      case "ready_for_delivery":
        return "pi-box";
      case "out_for_delivery":
        return "pi-truck";
      case "delivered":
        return "pi-check";
      case "cancelled":
        return "pi-times-circle";
      default:
        return "pi-info-circle";
    }
  };

  const getStatusSeverity = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "processing":
        return "info";
      case "ready_for_delivery":
        return "success";
      case "out_for_delivery":
        return "success";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "ready_for_delivery":
        return "Ready for Delivery";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getProgressSteps = (request) => {
    if (!request) return [];

    const statusMap = {
      pending: {
        title: "Order Created",
        description: "Your order has been successfully created",
        icon: "pi-clock",
      },
      confirmed: {
        title: "Order Confirmed",
        description: "Pharmacy has confirmed your order",
        icon: "pi-check-circle",
      },
      processing: {
        title: "Order Processing",
        description: "Your order is being processed by the pharmacy",
        icon: "pi-cog",
      },
      ready_for_delivery: {
        title: "Ready for Delivery",
        description: "Order packed and ready for delivery",
        icon: "pi-box",
      },
      out_for_delivery: {
        title: "Out for Delivery",
        description: "Order handed over to delivery partner",
        icon: "pi-truck",
      },
      delivered: {
        title: "Delivered",
        description: "Order delivered to customer",
        icon: "pi-check",
      },
      cancelled: {
        title: "Cancelled",
        description: request.cancellation?.reason || "Order has been cancelled",
        icon: "pi-times-circle",
      },
    };

    return request.statusHistory.map((history) => {
      const statusInfo = statusMap[history.status] || {
        title: history.status,
        description: history.note || "Status updated",
        icon: "pi-info-circle",
      };

      return {
        title: statusInfo.title,
        description: history.note || statusInfo.description,
        date: formatDate(history.timestamp),
        completed: true,
        icon: statusInfo.icon,
      };
    });
  };

  const calculateProgress = (request) => {
    if (!request) return 0;
    const steps = getProgressSteps(request);
    const completedSteps = steps.filter((step) => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  const CustomProgressBar = ({ value }) => {
    return (
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${value}%` }} />
      </div>
    );
  };

  const getOrderTypeIcon = (orderType) => {
    switch (orderType) {
      case "prescription_upload":
        return "pi pi-file-upload";
      case "medicine_search":
        return "pi pi-search";
      case "call_required":
        return "pi pi-phone";
      default:
        return "pi pi-shopping-bag";
    }
  };

  const getOrderTypeLabel = (orderType) => {
    switch (orderType) {
      case "prescription_upload":
        return "Prescription Upload";
      case "medicine_search":
        return "Medicine Search";
      case "call_required":
        return "Call Required";
      default:
        return "Order";
    }
  };
  const [showReorderConfirmation, setShowReorderConfirmation] = useState(false);
  const [reorderRequest, setReorderRequest] = useState(null);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  const requestTemplate = (request) => {
    return (
      <div className={styles.requestCard}>
        <div className={styles.requestHeader}>
          <div className={styles.requestInfo}>
            <div className={styles.requestNumber}>
              <i className={getOrderTypeIcon(request.orderType)}></i>
              Order #{request.orderId}
            </div>
            <div className={styles.orderTypeTag}>
              <Tag
                value={getOrderTypeLabel(request.orderType)}
                severity="info"
                className={styles.orderTypeTag}
              />
            </div>
            <Tag
              value={getStatusLabel(request.status)}
              severity={getStatusSeverity(request.status)}
              className={styles.requestStatus}
            />
          </div>
          <div className={styles.requestDate}>
            <i className="pi pi-calendar"></i>
            {formatDate(request.createdAt)}
          </div>
        </div>

        <div className={styles.requestSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Pharmacy:</span>
            <span className={styles.summaryValue}>
              {request.pharmacyId?.name || "Not specified"}
            </span>
          </div>
          {request.orderType === "medicine_search" &&
            request.items &&
            request.items.length > 0 && (
              <>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Items:</span>
                  <span className={styles.summaryValue}>
                    {request.items.length}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total:</span>
                  <span className={styles.summaryValue}>
                    ₹{request.payment?.amount?.total ?? 0}
                  </span>
                </div>
              </>
            )}
          {request.orderType === "prescription_upload" &&
            request.prescription?.url && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Prescription:</span>
                <span className={styles.summaryValue}>
                  {request.prescription.url.endsWith(".pdf") ? "PDF" : "Image"}{" "}
                  Uploaded
                </span>
              </div>
            )}
          {request.orderType === "call_required" && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Contact:</span>
              <span className={styles.summaryValue}>
                {request.contactNumber}
              </span>
            </div>
          )}
        </div>

        <div className={styles.statusTimeline}>
          {request.statusHistory && request.statusHistory.length > 0 && (
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <i className={`pi ${getStatusIcon(request.status)}`}></i>
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineStatus}>{request.status}</div>
                <div className={styles.timelineNote}>
                  {request.statusHistory[request.statusHistory.length - 1]
                    .note || "Status updated"}
                </div>
                <div className={styles.timelineDate}>
                  {formatDate(
                    request.statusHistory[request.statusHistory.length - 1]
                      .timestamp
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.cardActions}>
          {/* <button
          // className={styles.viewDetailsButton}
          onClick={() => {
            setSelectedRequest(request);
            setShowProgressDialog(true);
          }}
        >
          <i className="pi pi-info-circle"></i>
          View Order Details
        </button> */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {request.status === "pending" && (
              <Button
                label="Cancel Order"
                icon="pi pi-times-circle"
                style={{
                  padding: "0.5rem 1rem",
                }}
                severity="danger"
                raised
                text
                onClick={() => {
                  setSelectedRequest(request);
                  setShowCancelConfirmation(true);
                }}
              />
            )}
            {request.status === "delivered" && (
              <Button
                label="Re-Order"
                style={{
                  padding: "0.5rem 1rem",
                }}
                severity="success"
                raised
                icon="pi pi-shopping-cart"
                onClick={() => {
                  setReorderRequest(request);
                  setShowReorderConfirmation(true);
                }}
              />
            )}
            <Button
              label="Order Details"
              style={{
                padding: "0.5rem 1rem",
              }}
              raised
              icon="pi pi-info-circle"
              onClick={() => {
                setSelectedRequest(request);
                setShowProgressDialog(true);
              }}
            />
          </div>
        </div>
        <Dialog
          visible={showReorderConfirmation}
          onHide={() => setShowReorderConfirmation(false)}
          header={`Re-Order Confirmation`}
          style={{ width: isMobile ? "95vw" : "40vw" }}
        >
          <div>
            <p>
              Are you sure you want to re-order this order? This will create a
              new order with the same medicines.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                label="Cancel"
                icon="pi pi-times-circle"
                text
                raised
                severity="danger"
                onClick={() => setShowReorderConfirmation(false)}
              />
              <Button
                label="Confirm"
                icon="pi pi-check"
                onClick={() => {
                  console.log(request, "requestvalue");
                  handleReorder(request);
                }}
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  };

  const progressDialog = (
    <Dialog
      visible={showProgressDialog}
      onHide={() => setShowProgressDialog(false)}
      className={styles.progressDialog}
      header={
        selectedRequest
          ? `Order #${selectedRequest.orderId} Details`
          : "Order Details"
      }
    >
      <div className={styles.progressContent}>
        {selectedRequest ? (
          <>
            {/* Order Type Badge */}
            <div style={{ marginBottom: 16 }}>
              <Tag
                value={getOrderTypeLabel(selectedRequest.orderType)}
                severity="info"
                icon={getOrderTypeIcon(selectedRequest.orderType)}
                className={styles.orderTypeTag}
              />
            </div>

            {/* Prescription Preview - Show for prescription_upload and call_required with prescription */}
            {(selectedRequest.orderType === "prescription_upload" ||
              (selectedRequest.orderType === "call_required" &&
                selectedRequest.prescription?.url)) &&
              selectedRequest.prescription?.url && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 500, marginBottom: 6 }}>
                    Prescription:
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {(() => {
                      const url = selectedRequest.prescription.url;
                      if (!url) return <span>No file</span>;
                      if (url.endsWith(".pdf")) {
                        return (
                          <i
                            className="pi pi-file-pdf"
                            style={{ fontSize: 32, color: "#e57373" }}
                          ></i>
                        );
                      } else {
                        return (
                          <img
                            src={url}
                            alt="Prescription"
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 4,
                              border: "1px solid #e3e8ee",
                            }}
                          />
                        );
                      }
                    })()}
                    <Button
                      icon="pi pi-external-link"
                      className="p-button-text p-button-sm"
                      onClick={() => {
                        setEnlargedFile({
                          ...selectedRequest.prescription,
                          fileUrl: selectedRequest.prescription.url,
                        });
                        setShowEnlargeDialog(true);
                      }}
                      tooltip="Enlarge"
                      tooltipOptions={{ position: "top" }}
                    />
                  </div>
                </div>
              )}

            {/* Basic Order Information */}
            <div className={styles.orderDetailsSection}>
              <h3>Order Information</h3>
              <div className={styles.detailsTable}>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Order ID:</span>
                  <span className={styles.detailsValue}>
                    #{selectedRequest.orderId}
                  </span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Order Date:</span>
                  <span className={styles.detailsValue}>
                    {formatDate(selectedRequest.createdAt)}
                  </span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Status:</span>
                  <Tag
                    value={selectedRequest.status}
                    severity={getStatusSeverity(selectedRequest.status)}
                    className={styles.requestStatus}
                  />
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Pharmacy:</span>
                  <span className={styles.detailsValue}>
                    {selectedRequest.pharmacyId?.name || "Not specified"}
                  </span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Hospital/Clinic:</span>
                  <span className={styles.detailsValue}>
                    {selectedRequest.pharmacyId?.hospital || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Medicine Search Order Details */}
            {selectedRequest.orderType === "medicine_search" &&
              selectedRequest.items &&
              selectedRequest.items.length > 0 && (
                <div className={styles.orderDetailsSection}>
                  <h3>Medicines</h3>
                  <div className={styles.medicinesTable}>
                    <div className={styles.tableHeader}>
                      <span>Name</span>
                      <span>Quantity</span>
                      <span>Price</span>
                      <span>Total</span>
                    </div>
                    {selectedRequest.items.map((item, index) => (
                      <div key={index} className={styles.tableRow}>
                        <span className={styles.medicineName}>{item.name}</span>
                        <span className={styles.medicineQuantity}>
                          {item.quantity}
                        </span>
                        <span className={styles.medicinePrice}>
                          ₹{item.price}
                        </span>
                        <span className={styles.medicineTotal}>
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Payment Information - Show for medicine_search and prescription_upload with payment details */}
            {(selectedRequest.orderType === "medicine_search" ||
              (selectedRequest.orderType === "prescription_upload" &&
                selectedRequest.payment?.amount)) && (
              <div className={styles.orderDetailsSection}>
                <h3>Payment Information</h3>
                <div className={styles.detailsTable}>
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Payment Method:</span>
                    <span className={styles.detailsValue}>
                      {selectedRequest.payment.method}
                    </span>
                  </div>
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Payment Status:</span>
                    <Tag
                      value={selectedRequest.payment.status}
                      severity={
                        selectedRequest.payment.status === "completed"
                          ? "success"
                          : "warning"
                      }
                      className={styles.requestStatus}
                    />
                  </div>
                  {selectedRequest.payment?.amount && (
                    <>
                      <div className={styles.detailsRow}>
                        <span className={styles.detailsLabel}>Subtotal:</span>
                        <span className={styles.detailsValue}>
                          ₹{selectedRequest.payment.amount.subtotal ?? 0}
                        </span>
                      </div>
                      <div className={styles.detailsRow}>
                        <span className={styles.detailsLabel}>
                          Delivery Charge:
                        </span>
                        <span className={styles.detailsValue}>
                          ₹{selectedRequest.payment.amount.deliveryCharge ?? 0}
                        </span>
                      </div>
                      <div className={styles.detailsRow}>
                        <span className={styles.detailsLabel}>Tax:</span>
                        <span className={styles.detailsValue}>
                          ₹{selectedRequest.payment.amount.tax ?? 0}
                        </span>
                      </div>
                      <div className={styles.detailsRow}>
                        <span className={styles.detailsLabel}>
                          Total Amount:
                        </span>
                        <span className={styles.detailsValue}>
                          ₹{selectedRequest.payment.amount.total ?? 0}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Information */}
            <div className={styles.orderDetailsSection}>
              <h3>Delivery Information</h3>
              <div className={styles.detailsTable}>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Contact Number:</span>
                  <span className={styles.detailsValue}>
                    {selectedRequest.contactNumber}
                  </span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Address:</span>
                  <span className={styles.detailsValue}>
                    {selectedRequest.deliveryAddress.street},{" "}
                    {selectedRequest.deliveryAddress.city},
                    {selectedRequest.deliveryAddress.state} -{" "}
                    {selectedRequest.deliveryAddress.pincode}
                    {selectedRequest.deliveryAddress.landmark &&
                      ` (${selectedRequest.deliveryAddress.landmark})`}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {selectedRequest.notes && (
              <div className={styles.orderDetailsSection}>
                <h3>Notes</h3>
                <div className={styles.notesContent}>
                  {selectedRequest.notes}
                </div>
              </div>
            )}

            {/* Order Progress */}
            <div className={styles.orderDetailsSection}>
              <h3>Order Progress</h3>
              <CustomProgressBar value={calculateProgress(selectedRequest)} />
              <div className={styles.progressSteps}>
                {selectedRequest.statusHistory.map((history, index) => {
                  const statusInfo = {
                    pending: { icon: "pi-clock", title: "Order Created" },
                    confirmed: {
                      icon: "pi-check-circle",
                      title: "Order Confirmed",
                    },
                    processing: { icon: "pi-cog", title: "Order Processing" },
                    ready_for_delivery: {
                      icon: "pi-box",
                      title: "Ready for Delivery",
                    },
                    out_for_delivery: {
                      icon: "pi-truck",
                      title: "Out for Delivery",
                    },
                    delivered: { icon: "pi-check", title: "Delivered" },
                    cancelled: { icon: "pi-times-circle", title: "Cancelled" },
                  }[history.status] || {
                    icon: "pi-info-circle",
                    title: history.status,
                  };

                  return (
                    <div key={index} className={styles.progressStep}>
                      <div className={`${styles.stepIcon} completed`}>
                        <i className={`pi ${statusInfo.icon}`}></i>
                      </div>
                      <div className={styles.stepContent}>
                        <div className={styles.stepTitle}>
                          {statusInfo.title}
                        </div>
                        <div className={styles.stepDescription}>
                          {history.note || "Status updated"}
                        </div>
                        <div className={styles.stepDate}>
                          {formatDate(history.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.noDataMessage}>
            <i
              className="pi pi-exclamation-circle"
              style={{ fontSize: "2rem", color: "var(--text-color-secondary)" }}
            ></i>
            <p>No order data available</p>
          </div>
        )}
      </div>
    </Dialog>
  );

  return (
    <div className={styles.medicineRequests}>
      <Toast ref={toast} />

      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <label>Status</label>
          <Dropdown
            value={filters.status}
            options={statusOptions}
            onChange={(e) => onFilterChange({ ...filters, status: e.value })}
            placeholder="Select Status"
            showClear
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Start Date</label>
          <Calendar
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.value })}
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>

        <div className={styles.filterGroup}>
          <label>End Date</label>
          <Calendar
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.value })}
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>

        <Button
          label="Reset Filters"
          icon="pi pi-refresh"
          className="p-button-text"
          onClick={() =>
            onFilterChange({
              status: null,
              startDate: null,
              endDate: null,
            })
          }
        />
      </div>

      <div className={styles.searchContainer}>
        <IconField style={{ width: "100%" }} iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requests..."
            // className={styles.searchInput}
            style={{ width: "100%" }}
          />
        </IconField>
      </div>

      {/* <DataView
        value={requests.filter(request =>
          request.orderId.toString().includes(searchTerm) ||
          request.status.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        itemTemplate={requestTemplate}
        loading={loading}
        className={styles.requestsDataView}
      /> */}
      <div className={styles.requestsDataView}>
        {requests.map(
          (request, index) =>
            // <div key={index} className={styles.requestCard}>
            requestTemplate(request)
          // </div>
        )}
      </div>
      <Dialog
        header="Cancel Order"
        visible={showCancelConfirmation}
        onHide={() => setShowCancelConfirmation(false)}
        modal
      >
        <div>Are you sure you want to cancel this order?</div>
        <div style={{ width: "100%" }}>
          <Dropdown
            style={{ marginTop: "1rem", width: "100%" }}
            options={[
              { label: "Ordered by mistake", value: "ordered_by_mistake" },
              {
                label: "Found a better price elsewhere",
                value: "better_price",
              },
              { label: "Delivery is taking too long", value: "delivery_delay" },
              { label: "No longer needed", value: "no_longer_needed" },
              { label: "Ordered wrong item", value: "wrong_item" },
              { label: "Other", value: "other" },
            ]}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.value)}
            placeholder="Select Cancellation Reason"
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginTop: "1rem",
            padding: "1rem",
          }}
        >
          <Button
            label="Close"
            icon="pi pi-times-circle"
            raised
            text
            onClick={() => setShowCancelConfirmation(false)}
          />
          <Button
            label="Confirm"
            icon="pi pi-check"
            disabled={!cancellationReason}
            onClick={() => handleCancelOrder()}
          />
        </div>
      </Dialog>
      <div className={styles.paginationContainer}>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={onPageChange}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        />
      </div>

      {progressDialog}

      {/* Enlarge Dialog */}
      <Dialog
        header={
          enlargedFile
            ? enlargedFile.fileName || "Prescription Preview"
            : "Prescription Preview"
        }
        visible={showEnlargeDialog}
        style={{ width: "90vw", maxWidth: 900 }}
        onHide={() => setShowEnlargeDialog(false)}
        modal
      >
        {enlargedFile &&
          ((enlargedFile.fileUrl || "").endsWith(".pdf") ? (
            <PdfViewer url={enlargedFile.fileUrl} />
          ) : (
            <img
              src={enlargedFile.fileUrl}
              alt={enlargedFile.fileName}
              style={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          ))}
      </Dialog>
    </div>
  );
};

export default MedicineRequests;

import React from "react";

const Refunpolicycomp = () => {
  const tempstyles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    header: {
      textAlign: "center",
      paddingBottom: "20px",
      borderBottom: "2px solid #eaeaea",
    },
    title: {
      fontSize: "36px",
      color: "#333",
    },
    lastUpdated: {
      fontSize: "14px",
      color: "#888",
    },
    section: {
      padding: "20px 0",
      borderBottom: "1px solid #eaeaea",
    },
    subTitle: {
      fontSize: "24px",
      color: "#333",
      marginBottom: "10px",
    },
    text: {
      color: "#555",
      fontSize: "16px",
      marginBottom: "10px",
    },
    list: {
      color: "#555",
      fontSize: "16px",
      paddingLeft: "20px",
      listStyleType: "disc",
    },
  };
  return (
    <div style={tempstyles.container}>
      <div style={tempstyles.header}>
        <h1 style={tempstyles.title}>Refund Policy</h1>
        <p style={tempstyles.lastUpdated}>Last Updated: 01-08-2024</p>
      </div>

      <section style={tempstyles.section}>
        <h2 style={tempstyles.subTitle}>1. Appointment Booking Refunds</h2>
        <p style={tempstyles.text}>
          <strong>Doctor-Initiated Cancellations:</strong> If a doctor cancels
          or reschedules an appointment, you are eligible for a full refund of
          the booking fee. Refunds will be processed within 5-7 business days.
        </p>
        <p style={tempstyles.text}>
          <strong>User-Initiated Cancellations:</strong>
          <ul style={tempstyles.list}>
            <li>
              <strong>24 Hours or More Before the Appointment:</strong> Full
              refund of the booking fee.
            </li>
            <li>
              <strong>Less Than 24 Hours Before the Appointment:</strong> No
              refund will be provided.
            </li>
          </ul>
        </p>
        <p style={tempstyles.text}>
          <strong>No-Shows:</strong> If you do not attend the scheduled
          appointment without prior cancellation, no refund will be issued.
        </p>
      </section>

      <section style={tempstyles.section}>
        <h2 style={tempstyles.subTitle}>2. Medicine Orders Refunds</h2>
        <p style={tempstyles.text}>
          <strong>Cancellations Before Dispatch:</strong> If you cancel your
          order before it has been dispatched, you are eligible for a full
          refund of the amount paid.
        </p>
        <p style={tempstyles.text}>
          <strong>Cancellations After Dispatch:</strong> Once the order has been
          dispatched, cancellations are not allowed unless due to exceptional
          circumstances such as a damaged or incorrect order.
        </p>
        <p style={tempstyles.text}>
          <strong>Damaged or Incorrect Products:</strong> If you receive damaged
          or incorrect medicines, please notify us within 48 hours of delivery
          for a replacement or refund.
        </p>
      </section>

      <section style={tempstyles.section}>
        <h2 style={tempstyles.subTitle}>3. Refund Process</h2>
        <p style={tempstyles.text}>
          Refunds will be processed within 5-7 business days once approved. The
          amount will be credited back to the original payment method used
          during the transaction.
        </p>
        <p style={tempstyles.text}>
          Service fees may be non-refundable depending on the payment provider’s
          policy.
        </p>
      </section>

      <section style={tempstyles.section}>
        <h2 style={tempstyles.subTitle}>4. Non-Refundable Services</h2>
        <p style={tempstyles.text}>
          Some services may be non-refundable, such as consultations that have
          been completed, medicines that have been opened or used, and any
          service with specific non-refundable terms.
        </p>
      </section>

      <section style={tempstyles.section}>
        <h2 style={tempstyles.subTitle}>5. Special Circumstances</h2>
        <p style={tempstyles.text}>
          In certain special cases, Ayum.in may offer refunds at its discretion.
          Each case will be reviewed individually.
        </p>
      </section>

      <section style={tempstyles.section}>
        <h2 style={tempstyles.subTitle}>6. Contact Us</h2>
        <p style={tempstyles.text}>
          If you have any questions about refunds, please contact us at:
        </p>
        <p style={tempstyles.text}>
          <strong>Ayum Healthcare Private Limited</strong>
          <br />
          Rewa , Madhya Pradesh
          <br />
          Email: ayumdev@gmail.com
          <br />
        </p>
      </section>
    </div>
  );
};

export default Refunpolicycomp;

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: 01-08-2024</p>
      </div>
      <p>
        Welcome to{" "}
        <a style={{ color: "purple" }} href="https://ayum.in/">
          Ayum.in
        </a>
        , your trusted healthcare platform where managing appointments with
        doctors and receiving home-delivered medicines is made seamless and
        easy. At Ayum, we prioritize your privacy and ensure that your personal
        and medical data is protected at every step. With advanced security
        measures and strict data protection policies, we provide a secure
        environment where your information is handled with the utmost care, so
        you can focus on your health with complete peace of mind.
      </p>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>1. Information We Collect</h2>
        <p style={styles.text}>
          We collect the following types of information to provide and improve
          our services:
        </p>
        <h3 style={styles.smallTitle}>a. Personal Information</h3>
        <ul style={styles.list}>
          <li>Profile Information</li>
          <li>Appointment Details</li>
        </ul>

        <h3 style={styles.smallTitle}>b. Usage Data</h3>
        <ul style={styles.list}>
          <li>Device Information</li>
          <li>Activity Data</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>2. How We Use Your Information</h2>
        <p style={styles.text}>
          We use the collected information for the following purposes:
        </p>
        <ul style={styles.list}>
          <li>To Provide Services</li>
          <li>To Improve User Experience</li>
          <li>To Communicate with You</li>
          <li>To Ensure Safety and Security</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>3. How We Share Your Information</h2>
        <p style={styles.text}>
          We may share your information with third parties in the following
          situations:
        </p>
        <ul style={styles.list}>
          <li>With Service Providers</li>
          <li>For Legal Reasons</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>4. Data Security</h2>
        <p style={styles.text}>
          We take the security of your information seriously. However, no method
          of transmission over the internet or electronic storage is 100%
          secure, and we cannot guarantee absolute security but our systems and
          data flow are created in a way which is fully secured and encrypted.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>5. Your Rights</h2>
        <p style={styles.text}>
          You have the following rights concerning your personal information:
        </p>
        <ul style={styles.list}>
          <li>Access</li>
          <li>Correction</li>
          <li>Deletion</li>
          <li>Withdrawal of Consent</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>6. Third-Party Links</h2>
        <p style={styles.text}>
          Our Platform may contain links to third-party websites or services. We
          are not responsible for the privacy practices or content of these
          third-party sites.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>7. Changes to This Privacy Policy</h2>
        <p style={styles.text}>
          We may update this Privacy Policy from time to time. We will notify
          you of any material changes by posting the new policy on our Platform
          with a revised "Last Updated" date.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>8. Contact Us</h2>
        <p style={styles.text}>
          If you have any questions or concerns about this Privacy Policy or our
          data practices, please contact us at:
        </p>
        <p style={styles.text}>
          <strong>Ayum Healthcare Private Limited</strong>
          <br />
          Rewa , Madhya Pradesh , India
          <br />
          Email: ayumdev@gmail.com
          <br />
        </p>
      </section>
    </div>
  );
};

const styles = {
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
  smallTitle: {
    fontSize: "18px",
    color: "#555",
    marginTop: "15px",
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

export default PrivacyPolicy;

import React from "react";

const Termsconditions = () => {
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      lineHeight: "1.6",
      color: "#333",
    },
    header: {
      marginBottom: "20px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    lastUpdated: {
      fontSize: "14px",
      color: "#777",
    },
    section: {
      marginBottom: "30px",
    },
    subTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      marginBottom: "10px",
    },
    list: {
      marginLeft: "20px",
      fontSize: "16px",
      listStyleType: "disc",
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Terms and Conditions</h1>
        <p style={styles.lastUpdated}>Last Updated: 01-08-2024</p>
      </div>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>1. Acceptance of Terms</h2>
        <p style={styles.text}>
          By using Ayum.in, you agree to these Terms. If you do not agree,
          please do not use the Platform. We may update these Terms from time to
          time, and your continued use of the Platform after any changes
          indicates your acceptance of the new Terms.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>2. User Accounts</h2>
        <p style={styles.text}>
          <strong>Eligibility:</strong> You must be at least 18 years old to
          create an account on Ayum.in. By creating an account, you confirm that
          you meet this age requirement.
        </p>
        <p style={styles.text}>
          <strong>Account Security:</strong> You are responsible for maintaining
          the confidentiality of your account credentials. Any activities under
          your account are your responsibility. Notify us immediately if you
          suspect unauthorized use of your account.
        </p>
        <p style={styles.text}>
          <strong>Accuracy of Information:</strong> You agree to provide
          accurate and up-to-date information when creating your account. Ayum
          Healthcare is not responsible for any issues arising from inaccurate
          information.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>3. Services Provided</h2>
        <p style={styles.text}>
          Ayum.in facilitates the booking of appointments with doctors and the
          home delivery of medicines. However, we do not provide medical advice,
          diagnoses, or treatments. All healthcare services are provided by
          independent professionals, and you are responsible for your
          interactions with them.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>4. Medical Information Disclaimer</h2>
        <p style={styles.text}>
          The information on Ayum.in is provided for general informational
          purposes only and should not be considered medical advice. You should
          always consult a qualified healthcare provider for any medical
          concerns. Ayum Healthcare is not responsible for any health outcomes
          resulting from the use of our Platform.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>5. User Conduct</h2>
        <p style={styles.text}>By using Ayum.in, you agree to:</p>
        <ul style={styles.list}>
          <li>Comply with all applicable laws and regulations.</li>
          <li>
            Refrain from engaging in any unlawful, harmful, abusive, or
            disruptive behavior.
          </li>
          <li>
            Not misuse the Platform, including hacking, introducing viruses, or
            disrupting its functionality.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>6. Payments and Refunds</h2>
        <p style={styles.text}>
          Payments for services such as appointment bookings and medicine
          delivery are handled through secure third-party payment providers.
          Refunds are subject to the policies of the service providers, such as
          doctors or pharmacies.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>7. Third-Party Links</h2>
        <p style={styles.text}>
          Ayum.in may contain links to third-party websites or services that are
          not owned or controlled by us. We are not responsible for the content,
          privacy policies, or practices of third-party websites. Access to such
          websites is at your own risk.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>8. Limitation of Liability</h2>
        <p style={styles.text}>
          To the fullest extent permitted by law, Ayum Healthcare and its
          affiliates, officers, employees, and agents shall not be liable for
          any direct, indirect, incidental, special, or consequential damages
          arising out of your use of the Platform or any healthcare services.
        </p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.subTitle}>9. Governing Law</h2>
        <p style={styles.text}>
          These Terms shall be governed by and construed in accordance with the
          laws of [Insert Jurisdiction]. Any disputes relating to these Terms
          shall be subject to the exclusive jurisdiction of the courts located
          in [Insert Jurisdiction].
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>10. Changes to Terms</h2>
        <p style={styles.text}>
          Ayum Healthcare reserves the right to modify these Terms at any time.
          We will notify you of any changes by posting the updated Terms on our
          Platform. Your continued use of the Platform after any changes
          signifies your acceptance of the revised Terms.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subTitle}>11. Contact Information</h2>
        <p style={styles.text}>
          If you have any questions or concerns regarding these Terms, please
          contact us at ayumdev@gmail.com
        </p>
      </section>
    </div>
  );
};

export default Termsconditions;

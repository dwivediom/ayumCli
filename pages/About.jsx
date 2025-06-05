import Head from "next/head";
import React from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/newAbout.module.css";

const About = () => {
  return (
    <>
      <Head>
        <title>About Us - Ayum</title>
        <meta name="title" content="About Us - Ayum" />
        <meta
          name="description"
          content="Ayum is an innovative healthcare platform that revolutionizes the way you access medical services. Book appointments, get lab tests, and connect with healthcare providers seamlessly."
        />
      </Head>

      <div className={styles.aboutContainer}>
        {/* Contact Sales Section - Moved to top */}
        <section className={styles.contactSection}>
          <div className={styles.contactContent}>
            <h2>Contact Sales</h2>
            <p>Get in touch with our team for any inquiries</p>
            <a href="tel:9425681022" className={styles.contactButton}>
              <i className="pi pi-phone"></i>
              Call Us: 9425681022
            </a>
          </div>
        </section>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1>Transforming Healthcare Access</h1>
            <p>Your trusted partner in healthcare management</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.missionSection}>
          <div className={styles.missionContent}>
            <h2>Our Mission</h2>
            <p>
              To make healthcare accessible, affordable, and efficient for
              everyone through innovative technology solutions.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2>Our Services</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <i className="pi pi-calendar"></i>
              <h3>Easy Appointments</h3>
              <p>
                Book doctor appointments instantly with our user-friendly
                platform
              </p>
            </div>

            <div className={styles.featureCard}>
              <i className="pi pi-shopping-cart"></i>
              <h3>Medical Store Management</h3>
              <p>
                Complete software solution for managing your medical store
                inventory and sales
              </p>
            </div>
            <div className={styles.featureCard}>
              <i className="pi pi-hospital"></i>
              <h3>Clinic Management</h3>
              <p>
                Streamline your clinic operations with our comprehensive
                management system
              </p>
            </div>
            <div className={styles.featureCard}>
              <i className="pi pi-chart-line"></i>
              <h3>Analytics Dashboard</h3>
              <p>
                Track your business performance with detailed analytics and
                reports
              </p>
            </div>
            <div className={styles.featureCard}>
              <i className="pi pi-globe"></i>
              <h3>Multi-location Support</h3>
              <p>
                Manage multiple branches and locations from a single dashboard
              </p>
            </div>
            <div className={styles.featureCard}>
              <i className="pi pi-heart"></i>
              <h3>Lab Tests</h3>
              <p>
                Get lab tests done at 30-50% off with home sample collection
              </p>
            </div>
            <div className={styles.featureCard}>
              <i className="pi pi-users"></i>
              <h3>Virtual Blood Bank</h3>
              <p>India's most efficient blood donation and request system</p>
            </div>
            <div className={styles.featureCard}>
              <i className="pi pi-mobile"></i>
              <h3>Digital Reports</h3>
              <p>Access all your medical reports directly on your smartphone</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;

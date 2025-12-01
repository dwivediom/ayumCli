import React, { useEffect, useState } from "react";
import styles from "./profilestyle.module.css";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import CustomRating from "./CustomRating";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { generateLast100Years } from "../redux/constants/docConstants";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
const NewDocprofile = ({ item, key, docid, showreview, isMobile }) => {
  const [profiledata, setprofiledata] = useState();
  const GetProfleData = async () => {
    const prodata = await axios({
      method: "post",
      url: `${
        process.env.NEXT_PUBLIC_B_PORT
      }/api/user/getdoctorprofiledata?id=${
        item.onAyum ? item.doctorid : docid
      }`,
      headers: {
        "x-auth-token": localStorage.usertoken,
      },
      data: {},
    });
    console.log(prodata.data?.data, "prodata");
    setprofiledata(prodata.data?.data);
    // setappocount(prodata?.data?.data?.appocount);
  };
  const router = useRouter();
  useEffect(() => {
    GetProfleData();
  }, []);

  return (
    <div
      style={{
        padding: "15px",
        paddingTop: "1.5rem",
        position: "relative",
        width: "100%",
        minWidth: isMobile && "23rem",
      }}
      className={styles.submainbox}
    >
      {docid && (
        <Head>
          <title>
            {`${item.name} ${item.city} , ${item.specialist}`} {"- Ayum"}{" "}
          </title>
          <meta
            name="Title"
            content={`${item.name} ${item.city} in ${item.address?.slice(
              0,
              20
            )} - Best ${item.specialist} in ${item.city} ${item.address?.slice(
              0,
              20
            )} - Ayum`}
          ></meta>
          <meta
            name="description"
            content={`${item.name} ${item.city}  in ${item.address?.slice(
              0,
              20
            )}. Top ${item.specialist} Doctors ${item.address?.slice(
              0,
              20
            )}.Visiting Time, Contact Number, Clinic Address, Map of ${
              item.name
            } ,${item.city} ${item.address?.slice(0, 20)} `}
          ></meta>

          <meta
            name="keywords"
            content={`${item.name} ${item.city}, Contact number, Phone number, Address, Map,${item.name} ${item.city}, Directions, Official website link, Working hours, Services`}
          ></meta>
          <meta
            name="twitter:title"
            content={`${item.name} in  ${item.city},${item.address?.slice(
              0,
              20
            )}  - Best ${item.specialist} Doctors in  ${
              item.city
            } , ${item.address?.slice(0, 20)}  - Ayum`}
          ></meta>
          <meta
            name="twitter:description"
            content={`${item.name}  in ${item.address?.slice(0, 20)}. Top ${
              item.specialist
            } Doctors ${item.address?.slice(
              0,
              20
            )}.Visiting Time, Contact Number, Clinic Address, Map of ${
              item.name
            } ,${item.city} ${item.address?.slice(0, 20)} - Ayum `}
          ></meta>

          <meta name="twitter:image" content="https://ayum.in/Ayumcover.jpg" />
          <meta
            name="twitter:url"
            content={`https://www.ayum.in/doctor?docid=${item._id}`}
          />
          <meta
            property="og:title"
            content={`${item.name}, ${item.city}, ${item.address?.slice(
              0,
              20
            )} - Ayum`}
          ></meta>
          <meta property="og:type" content="website"></meta>
          <meta
            property="og:url"
            content={`https://www.ayum.in/doctor?docid=${item._id}`}
          ></meta>
          <meta
            property="og:image"
            content="https://www.ayum.in/Ayumcover.jpg"
          ></meta>
          <meta
            property="og:image:secure_url"
            content="https://ayum.in/Ayumcover.jpg"
          ></meta>
          <meta property="og:image:width" content="630"></meta>
          <meta property="og:image:height" content="473"></meta>
          <meta
            property="og:description"
            content={`Get Address, Contact Number, Photos, Maps of ${
              item.name
            },Phone-${item.phone.toString()?.slice(0, 5)}...  ${
              item.city
            }, ${item.address?.slice(0, 20)} ,  on Ayum`}
          ></meta>
          {/* <meta name="viewport" content="viewport-fit=cover"></meta> */}
          <meta
            property="al:ios:url"
            content={`https://www.ayum.in/doctor?docid=${item._id}`}
          ></meta>
          <link
            rel="alternate"
            media="only screen and (max-width: 640px)"
            href={`https://www.ayum.in/doctor?docid=${item._id} `}
          ></link>
          <link
            rel="alternate"
            href={`https://www.ayum.in/doctor?docid=${item._id} `}
          ></link>
          <link
            rel="canonical"
            href={`https://www.ayum.in/doctor?docid=${item._id} `}
          ></link>

          {/* Meta tags for SEO optimization */}

          <meta name="author" content={item.name} />
          <meta name="robots" content="index, follow" />
          {/* Add other meta tags as needed */}
        </Head>
      )}
      <div
        style={{
          padding: isMobile ? "20px 15px" : "30px 25px",
          position: "relative",
        }}
        className={styles.submainbox}
      >
        {isMobile ? (
          <span className={styles.viewToPatientsMobile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              style={{ width: "16px", height: "16px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            View to patients
          </span>
        ) : (
          <span
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "8px 12px",
              borderRadius: "20px",
              color: "white",
              fontSize: "13px",
              fontWeight: "500",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
              zIndex: 10,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              style={{ width: "16px", height: "16px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            View to patients
          </span>
        )}

        {/* Profile Header Section */}
        <div className={styles.profileHeader}>
          <div className={styles.profileImageWrapper}>
            <Image
              alt={profiledata ? profiledata.name : ""}
              className={styles.profileImage}
              src={
                profiledata ? profiledata?.picture?.replace(/=s\d+-c/, "") : ""
              }
              width={isMobile ? 120 : 180}
              height={isMobile ? 120 : 180}
            />
            {profiledata?.avgrating && (
              <div className={styles.ratingBadge}>
                <span
                  className="pi pi-star-fill"
                  style={{ fontSize: "14px", marginRight: "4px" }}
                ></span>
                <span style={{ fontWeight: "600" }}>
                  {profiledata?.avgrating}
                </span>
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>
              {profiledata && profiledata?.name}
            </h1>
            <div className={styles.profileMeta}>
              <span className={styles.regNumber}>
                <span
                  className="pi pi-id-card"
                  style={{ marginRight: "6px" }}
                ></span>
                Reg. No: {profiledata?.regno || "N/A"}
              </span>
              <span className={styles.specialization}>
                <span
                  className="pi pi-briefcase"
                  style={{ marginRight: "6px" }}
                ></span>
                {profiledata?.specialist?.charAt(0).toUpperCase() +
                  profiledata?.specialist?.slice(
                    1,
                    profiledata?.specialist?.length
                  ) || "General Practitioner"}
              </span>
              <span className={styles.location}>
                <span
                  className="pi pi-map-marker"
                  style={{ marginRight: "6px" }}
                ></span>
                {profiledata?.city || "City"}, India
              </span>
            </div>
            {!profiledata?.avgrating && (
              <div className={styles.noRatingBadge}>
                <span>Not rated yet</span>
              </div>
            )}
            {!isMobile && (
              <div className={styles.profileactions}>
                <div
                  onClick={() => router.push(`/clinics?id=${profiledata?._id}`)}
                  className={styles.profilesubaction1}
                >
                  <span
                    className="pi pi-calendar"
                    style={{ marginRight: "6px" }}
                  ></span>
                  Book Appointment
                </div>
                <div className={styles.profilesubaction2}>
                  <span
                    className="pi pi-map"
                    style={{ marginRight: "6px" }}
                  ></span>
                  View On Map
                </div>
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <div className={styles.profileactions} style={{ marginTop: "15px" }}>
            <div
              onClick={() => router.push(`/clinics?id=${profiledata?._id}`)}
              className={styles.profilesubaction1}
            >
              <span
                className="pi pi-calendar"
                style={{ marginRight: "6px" }}
              ></span>
              Book Appointment
            </div>
            <div className={styles.profilesubaction2}>
              <span className="pi pi-map" style={{ marginRight: "6px" }}></span>
              View On Map
            </div>
          </div>
        )}

        {/* Languages Section - Mobile Friendly */}
        <div className={styles.languagesCard}>
          <div className={styles.languagesHeader}>
            <div className={styles.languagesIcon}>
              <span className="pi pi-globe"></span>
            </div>
            <span className={styles.languagesTitle}>Languages</span>
          </div>
          <div className={styles.languageTags}>
            <span className={styles.languageTag}>English</span>
            <span className={styles.languageTag}>Hindi</span>
          </div>
        </div>

        {/* Bio Section */}
        <div className={styles.bioSection}>
          <h3 className={styles.sectionTitle}>
            <span className="pi pi-user" style={{ marginRight: "8px" }}></span>
            About
          </h3>
          <p className={styles.bioText}>
            {profiledata?.bio ||
              "No bio available. Please update your profile to add information about yourself and your practice."}
          </p>
        </div>

        {/* Commonly Treats Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span className="pi pi-heart" style={{ marginRight: "8px" }}></span>
            Commonly Treats
          </h3>
          <div className={styles.treatsGrid}>
            <div className={styles.treatItem}>Heart Rate</div>
            <div className={styles.treatItem}>Neck Pain</div>
            <div className={styles.treatItem}>Throat</div>
            <div className={styles.treatItem}>Headache</div>
          </div>
        </div>

        {/* Registration Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span
              className="pi pi-shield"
              style={{ marginRight: "8px" }}
            ></span>
            Registration Details
          </h3>
          <div className={styles.registrationInfo}>
            <span className={styles.registrationNumber}>
              {profiledata?.regno || "Not provided"}
            </span>
          </div>
        </div>

        {/* Experience Section */}
        {profiledata?.experience && profiledata?.experience.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span
                className="pi pi-briefcase"
                style={{ marginRight: "8px" }}
              ></span>
              Professional Experience
            </h3>
            <div className={styles.experienceGrid}>
              {profiledata.experience.map((item, index) => (
                <div key={index} className={styles.expcard}>
                  <div className={styles.expIcon}>
                    <span
                      className="pi pi-building"
                      style={{ fontSize: "24px" }}
                    ></span>
                  </div>
                  <div className={styles.expContent}>
                    <h4 className={styles.expPosition}>{item?.position}</h4>
                    <p className={styles.expOrganization}>
                      {item?.organization}
                    </p>
                    <p className={styles.expLocation}>
                      <span
                        className="pi pi-map-marker"
                        style={{ fontSize: "12px", marginRight: "4px" }}
                      ></span>
                      {item?.location}
                    </p>
                    <p className={styles.expDuration}>
                      {item?.from} - {item?.current ? "Present" : item?.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profiledata?.education && profiledata?.education.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span
                className="pi pi-graduation-cap"
                style={{ marginRight: "8px" }}
              ></span>
              Educational Qualifications
            </h3>
            <div className={styles.educationGrid}>
              {profiledata.education.map((item, index) => (
                <div key={index} className={styles.educard}>
                  <div className={styles.eduIcon}>
                    <span
                      className="pi pi-book"
                      style={{ fontSize: "24px" }}
                    ></span>
                  </div>
                  <div className={styles.eduContent}>
                    <h4 className={styles.eduDegree}>{item?.degree}</h4>
                    <p className={styles.eduSchool}>{item?.school}</p>
                    <p className={styles.eduField}>
                      Field: {item?.fieldofstudy}
                    </p>
                    <p className={styles.eduDuration}>
                      {item?.from} - {item?.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span
              className="pi pi-certificate"
              style={{ marginRight: "8px" }}
            ></span>
            Certifications & Licenses
          </h3>
          <div className={styles.certificationsGrid}>
            <div className={styles.certCard}>
              <div className={styles.certIcon}>
                <span
                  className="pi pi-verified"
                  style={{ fontSize: "24px" }}
                ></span>
              </div>
              <div className={styles.certContent}>
                <h4 className={styles.certTitle}>
                  Medical Council Registration
                </h4>
                <p className={styles.certIssuer}>Medical Council of India</p>
                <p className={styles.certDate}>Issued: 2015</p>
                <p className={styles.certStatus}>
                  <span className={styles.statusBadge}>Active</span>
                </p>
              </div>
            </div>
            <div className={styles.certCard}>
              <div className={styles.certIcon}>
                <span
                  className="pi pi-verified"
                  style={{ fontSize: "24px" }}
                ></span>
              </div>
              <div className={styles.certContent}>
                <h4 className={styles.certTitle}>
                  Advanced Cardiac Life Support (ACLS)
                </h4>
                <p className={styles.certIssuer}>American Heart Association</p>
                <p className={styles.certDate}>Issued: 2018</p>
                <p className={styles.certStatus}>
                  <span className={styles.statusBadge}>Valid</span>
                </p>
              </div>
            </div>
            <div className={styles.certCard}>
              <div className={styles.certIcon}>
                <span
                  className="pi pi-verified"
                  style={{ fontSize: "24px" }}
                ></span>
              </div>
              <div className={styles.certContent}>
                <h4 className={styles.certTitle}>
                  Board Certification in Internal Medicine
                </h4>
                <p className={styles.certIssuer}>
                  National Board of Examinations
                </p>
                <p className={styles.certDate}>Issued: 2016</p>
                <p className={styles.certStatus}>
                  <span className={styles.statusBadge}>Active</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Awards & Recognition Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span
              className="pi pi-trophy"
              style={{ marginRight: "8px" }}
            ></span>
            Awards & Recognition
          </h3>
          <div className={styles.awardsGrid}>
            <div className={styles.awardCard}>
              <div className={styles.awardIcon}>
                <span
                  className="pi pi-star"
                  style={{ fontSize: "28px" }}
                ></span>
              </div>
              <div className={styles.awardContent}>
                <h4 className={styles.awardTitle}>Best Doctor Award 2022</h4>
                <p className={styles.awardOrg}>State Medical Association</p>
                <p className={styles.awardYear}>2022</p>
              </div>
            </div>
            <div className={styles.awardCard}>
              <div className={styles.awardIcon}>
                <span
                  className="pi pi-medal"
                  style={{ fontSize: "28px" }}
                ></span>
              </div>
              <div className={styles.awardContent}>
                <h4 className={styles.awardTitle}>
                  Excellence in Patient Care
                </h4>
                <p className={styles.awardOrg}>Healthcare Excellence</p>
                <p className={styles.awardYear}>2021</p>
              </div>
            </div>
            <div className={styles.awardCard}>
              <div className={styles.awardIcon}>
                <span
                  className="pi pi-award"
                  style={{ fontSize: "28px" }}
                ></span>
              </div>
              <div className={styles.awardContent}>
                <h4 className={styles.awardTitle}>
                  Outstanding Medical Professional
                </h4>
                <p className={styles.awardOrg}>Medical Excellence Forum</p>
                <p className={styles.awardYear}>2020</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Offered Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span className="pi pi-cog" style={{ marginRight: "8px" }}></span>
            Services Offered
          </h3>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceItem}>
              <span
                className="pi pi-check-circle"
                style={{ marginRight: "8px", color: "#38ef7d" }}
              ></span>
              General Consultation
            </div>
            <div className={styles.serviceItem}>
              <span
                className="pi pi-check-circle"
                style={{ marginRight: "8px", color: "#38ef7d" }}
              ></span>
              Health Check-ups
            </div>
            <div className={styles.serviceItem}>
              <span
                className="pi pi-check-circle"
                style={{ marginRight: "8px", color: "#38ef7d" }}
              ></span>
              Preventive Care
            </div>
            <div className={styles.serviceItem}>
              <span
                className="pi pi-check-circle"
                style={{ marginRight: "8px", color: "#38ef7d" }}
              ></span>
              Chronic Disease Management
            </div>
            <div className={styles.serviceItem}>
              <span
                className="pi pi-check-circle"
                style={{ marginRight: "8px", color: "#38ef7d" }}
              ></span>
              Vaccination Services
            </div>
            <div className={styles.serviceItem}>
              <span
                className="pi pi-check-circle"
                style={{ marginRight: "8px", color: "#38ef7d" }}
              ></span>
              Health Counseling
            </div>
          </div>
        </div>

        {/* Patient Reviews Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span
              className="pi pi-comments"
              style={{ marginRight: "8px" }}
            ></span>
            Patient Reviews
            <span className={styles.reviewCount}>(24 reviews)</span>
          </h3>
          <div className={styles.reviewsContainer}>
            <div className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.reviewerAvatar}>
                    <span
                      className="pi pi-user"
                      style={{ fontSize: "20px" }}
                    ></span>
                  </div>
                  <div>
                    <h4 className={styles.reviewerName}>Rajesh Kumar</h4>
                    <p className={styles.reviewDate}>2 weeks ago</p>
                  </div>
                </div>
                <div className={styles.reviewRating}>
                  <Rating value={5} readOnly cancel={false} />
                </div>
              </div>
              <p className={styles.reviewText}>
                Excellent doctor! Very patient and understanding. Took time to
                explain everything clearly. Highly recommended!
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.reviewerAvatar}>
                    <span
                      className="pi pi-user"
                      style={{ fontSize: "20px" }}
                    ></span>
                  </div>
                  <div>
                    <h4 className={styles.reviewerName}>Priya Sharma</h4>
                    <p className={styles.reviewDate}>1 month ago</p>
                  </div>
                </div>
                <div className={styles.reviewRating}>
                  <Rating value={5} readOnly cancel={false} />
                </div>
              </div>
              <p className={styles.reviewText}>
                Dr. {profiledata?.name || "Doctor"} is very professional and
                caring. The clinic is well-maintained and the staff is
                courteous.
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.reviewerAvatar}>
                    <span
                      className="pi pi-user"
                      style={{ fontSize: "20px" }}
                    ></span>
                  </div>
                  <div>
                    <h4 className={styles.reviewerName}>Amit Patel</h4>
                    <p className={styles.reviewDate}>2 months ago</p>
                  </div>
                </div>
                <div className={styles.reviewRating}>
                  <Rating value={4} readOnly cancel={false} />
                </div>
              </div>
              <p className={styles.reviewText}>
                Good experience overall. The doctor provided clear diagnosis and
                treatment plan. Would visit again.
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.reviewerAvatar}>
                    <span
                      className="pi pi-user"
                      style={{ fontSize: "20px" }}
                    ></span>
                  </div>
                  <div>
                    <h4 className={styles.reviewerName}>Sneha Reddy</h4>
                    <p className={styles.reviewDate}>3 months ago</p>
                  </div>
                </div>
                <div className={styles.reviewRating}>
                  <Rating value={5} readOnly cancel={false} />
                </div>
              </div>
              <p className={styles.reviewText}>
                Best doctor in the area! Very knowledgeable and approachable.
                The waiting time was minimal and the consultation was thorough.
              </p>
            </div>
          </div>
          <button className={styles.viewAllReviewsBtn}>
            View All Reviews
            <span
              className="pi pi-arrow-right"
              style={{ marginLeft: "8px" }}
            ></span>
          </button>
        </div>

        {/* Contact & Social Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span className="pi pi-phone" style={{ marginRight: "8px" }}></span>
            Contact Information
          </h3>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <span
                  className="pi pi-phone"
                  style={{ fontSize: "20px" }}
                ></span>
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Phone</span>
                <span className={styles.contactValue}>+91 98765 43210</span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <span
                  className="pi pi-envelope"
                  style={{ fontSize: "20px" }}
                ></span>
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>doctor@clinic.com</span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <span
                  className="pi pi-map-marker"
                  style={{ fontSize: "20px" }}
                ></span>
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Address</span>
                <span className={styles.contactValue}>
                  {profiledata?.city || "City"}, India
                </span>
              </div>
            </div>
          </div>
          <div className={styles.socialLinks}>
            <h4
              style={{
                marginBottom: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4a5568",
              }}
            >
              Connect on Social Media
            </h4>
            <div className={styles.socialIcons}>
              <a
                href="#"
                className={styles.socialLink}
                style={{ background: "#1877f2" }}
              >
                <span className="pi pi-facebook"></span>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                style={{ background: "#1da1f2" }}
              >
                <span className="pi pi-twitter"></span>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                style={{ background: "#0077b5" }}
              >
                <span className="pi pi-linkedin"></span>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                style={{ background: "#e4405f" }}
              >
                <span className="pi pi-instagram"></span>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                style={{ background: "#ff0000" }}
              >
                <span className="pi pi-youtube"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDocprofile;

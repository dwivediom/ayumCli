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
          display: "flex",
          gap: "1rem",
        }}
      >
        <img
          alt={item.name}
          style={{
            width: isMobile ? "100px" : "150px",
            height: isMobile ? "100px" : "150px",
            borderRadius: "50%",
            objectFit: "cover",
            minWidth: "0",
            minHeight: "0",
            boxShadow: "2px 3px 6px rgba(0,0,0,0.1)",
          }}
          src={profiledata ? profiledata?.picture?.replace(/=s\d+-c/, "") : ""}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            gap: "3px",
            width: "60%",
          }}
        >
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Dr. {profiledata && profiledata?.name}
          </span>
          <span className={styles.lighttextcolor}>RegNo - 03902</span>
          <span
            style={{ fontStyle: "italic" }}
            className={styles.lighttextcolor}
          >
            Dermatologist in Rewa , India
          </span>
          <Button
            style={{
              padding: "10px",
              height: "1.5rem",
              width: "fit-content",
              background: "green",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              color: "white",
              border: "none",
            }}
            label="4.5"
            icon="pi pi-star-fill"
            iconPos="right"
          />
          {!isMobile && (
            <div className={styles.profileactions}>
              <div
                onClick={() => {
                  router.push(`/clinics?id=${profiledata?._id}`);
                }}
                className={styles.profilesubaction1}
              >
                Book Appointment
              </div>
              <div className={styles.profilesubaction2}>View On Map</div>
            </div>
          )}
          {isMobile && (
            <div
              style={{
                padding: "5px",
                borderRadius: "4px",
                marginTop: "3px",
                background: "#EDF0F8",
                paddingLeft: "10px",
              }}
            >
              <span>Experience :</span> <span>6+ yrs</span>
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
          }}
          className={styles.profileactions}
        >
          <div className={styles.profilesubaction2}>View On Map</div>
          <div
            onClick={() => {
              router.push(`/clinics?id=${profiledata?._id}`);
            }}
            className={styles.profilesubaction1}
          >
            Book Appointment
          </div>
        </div>
      )}

      <div className={styles.explangcard}>
        {!isMobile && (
          <div className={styles.subexplangcard1}>
            {" "}
            <span>Overall Experience :</span> <span>6+ yrs</span>
          </div>
        )}

        <div
          style={{ width: isMobile && "100%" }}
          className={styles.subexplangcard2}
        >
          {" "}
          <span>Languages :</span>{" "}
          <div style={{ display: "flex", gap: "5px" }}>
            <span>English</span>
            <span>Hindi</span>
          </div>{" "}
        </div>
      </div>
      <div className={styles.storycard}>
        {profiledata?.bio
          ? profiledata?.bio
          : "Show a summary about yourself...."}
      </div>
      <div className={styles.commonlytreats}>
        <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          Commonly Treats
        </span>
        <div
          style={{
            display: "flex",
            gap: "10px",
            // padding: "10px",
            flexWrap: "wrap",
            paddingTop: "5px",
          }}
        >
          <div className={styles.commonlytreatsbox}>Heart Rate</div>
          <div className={styles.commonlytreatsbox}>Neck Pain</div>
          <div className={styles.commonlytreatsbox}>Throat</div>
          <div className={styles.commonlytreatsbox}>Headache</div>
        </div>
      </div>
      <div className={styles.registrationbox}>
        <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          Registration
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            {profiledata?.regno ? profiledata?.regno : ""}
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            23-06-2010
          </span>
        </div>
      </div>
      <div className={styles.edubox}>
        <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          Experience
        </span>
        <div
          style={{
            // marginTop: "10px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {profiledata?.experience &&
            profiledata?.experience.map((item) => {
              return (
                <div
                  style={{
                    // border: "1px solid red",
                    color: "white",
                    boxShadow: "3px 4px 10px rgba(0,0,0,0.3)",

                    width: "fit-content",
                    width: "20rem",
                    padding: "0 10px",

                    position: "relative",
                  }}
                  className={styles.expcard}
                >
                  <img
                    src="/medaliconpng.png"
                    style={{
                      position: "absolute",
                      width: "35px",
                      height: "35px",
                      transform: "rotate(0deg)",
                      right: "10px",
                      bottom: "10px",
                    }}
                  />
                  <p>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>
                      {item?.position}
                    </span>{" "}
                    <span>{item?.organization}</span>{" "}
                  </p>
                  <p>
                    {" "}
                    <span>{item?.location}</span>
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    From {item?.from} - To {item?.to}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.edubox}>
        <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          Educational Qualifications
        </span>
        {profiledata?.education &&
          profiledata?.education.map((item) => {
            return (
              <div
                style={{
                  // border: "1px solid red",
                  color: "white",
                  boxShadow: "3px 4px 15px rgba(0,0,0,0.3)",
                  padding: "0 10px",
                  width: "fit-content",
                  width: "20rem",
                  position: "relative",
                }}
                className={styles.educard}
              >
                <img
                  src="/medaliconpng.png"
                  style={{
                    position: "absolute",
                    width: "35px",
                    height: "35px",
                    transform: "rotate(0deg)",
                    right: "10px",
                    bottom: "10px",
                  }}
                />
                <p>
                  {" "}
                  <span style={{ fontWeight: "bold" }}>
                    {item?.degree}
                  </span>{" "}
                  From <span>{item?.school}</span>{" "}
                </p>
                <p>
                  {" "}
                  <span>Field of study - {item?.fieldofstudy}</span>
                </p>
                <p style={{ fontSize: "14px" }}>
                  From {item?.from} - To {item?.to}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default NewDocprofile;

import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../styles/Phonebook.module.css";
// import {
//   Alert,
//   Box,
//   Button,
//   Chip,
//   Container,
//   List,
//   ListItem,
//   Modal,
//   Paper,
//   Snackbar,
//   TextField,
//   Typography,
// } from "@mui/material";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import CallIcon from "@mui/icons-material/Call";
// import English from "../public/locales/en/index";
// import Hindi from "../public/locales/hi/index";
import { AccountContext } from "../context/AccountProvider";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Router, { useRouter } from "next/router";
// import { styled } from "@mui/material/styles";
import Head from "next/head";
// import Rating from "@mui/material/Rating";
// import StarIcon from "@mui/icons-material/Star";
// import { StarBorder } from "@mui/icons-material";
import Image from "next/image";
import axios from "axios";
import { calculateAverageRating, formatDate } from "../public/utils/Utils";
import HindiRating from "../public/locales/hi/reviewoption";
import EnglishRating from "../public/locales/en/reviewoption";
import LoginPopup from "./UserAuth/LoginPopup";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";

// const StyledRating = styled(Rating)({
//   "& .MuiRating-iconFilled": {
//     color: "#FFC100",
//   },
//   "& .MuiRating-iconHover": {
//     color: "#FFC100",
//   },
// });

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "21rem",
  // bgcolor:
  //   "linear-gradient(90deg, rgba(0,172,89,1) 0%, rgba(0,162,71,1) 35%, rgba(0,255,179,1) 100%)",
  borderRadius: "12px",
  color: "black",
  boxShadow: "none",
  outline: "none",
  boxShadow: "0 0 20px rgba(0, 255, 255, 0.236)",

  // background: "linear-gradient(to right,  rgba(255,255,255,1),  #cfcfcf)",
  background: "#fff",
  p: 4,
};
const DirectoryCard = ({ item, key, docid, showreview }) => {
  const { lang, openDrawer } = useContext(AccountContext);

  const [show, setShow] = useState(false);
  const [sharemodal, setsharemodal] = useState(false);
  const [callmodal, setcallmodal] = useState(false);
  const [location, setlocation] = useState({ lat: " ", lon: " " });

  const handleCall = (phoneNumber) => {
    console.log(phoneNumber, "call");
    if (!isMobile) {
      setsnackmsg("This Service is Available For Mobile Devices Only!");
      setseverity("error");
      setshowsnackbar(true);
      return;
    }
    window.location.href = `tel:${phoneNumber}`;
  };
  const isLocal = process.env.NODE_ENV === "development"; // Check if environment is development (local)

  const [isMobile, setIsMobile] = useState(false);
  const [showsnackbar, setshowsnackbar] = useState(false);
  const [severity, setseverity] = useState("success");
  const [snackmsg, setsnackmsg] = useState("");
  const [selectedphones, setselectedphones] = useState([]);
  const [linktext, setlinktext] = useState("");

  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);
  const [copied, setcpied] = useState(false);
  const router = useRouter();
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setcpied(true);
  };
  const shareOnWhatsApp = (name) => {
    const message = `Get ${name} info on Ayum , Click the link below 👇👇 
${linktext}`;

    // Construct the WhatsApp share URL with the message
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;

    // Open the WhatsApp share URL in a new window
    window.open(whatsappURL, "_blank");
  };

  const [reviews, setReviews] = useState([]);
  const [reviewgiven, setreviewgiven] = useState();
  const [tempreview, settempreview] = useState(false);
  const [loading, setloading] = useState(false);
  const GetReviews = async () => {
    setloading(true);
    try {
      const allreviews = await axios({
        url: `${process.env.NEXT_PUBLIC_B_PORT}/api/docdirectory/${item._id}/reviews`,
        method: "get",
      });
      console.log(allreviews, "allreview");
      setReviews(allreviews?.data?.reviews);
      const UserData = JSON.parse(localStorage.getItem("labuser"));
      console.log("foundreviewval", foundReview, allreviews, UserData);

      const foundReview = allreviews?.data?.reviews?.find((obj) => {
        return obj["useremail"] == UserData?.email;
      });
      setreviewgiven(foundReview);
      setloading(false);
    } catch (error) {
      setloading(false);
      return error.message;
    }
  };

  useEffect(() => {
    GetReviews();
  }, []);
  const [newReview, setNewReview] = useState({
    rating: "",
    message: "",
    username: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };
  const [open, setOpen] = useState(true);

  const handleSubmit = async () => {
    // e.preventDefault();
    // const today = new Date().toISOString().split("T")[0];
    // setReviews([...reviews, { ...newReview, createdDate: today }]);
    // setNewReview({ rating: "", message: "", username: "" });
    const UserData = JSON.parse(localStorage.getItem("labuser"));
    if (!UserData) {
      // router.push("/User/UserRegistrationPage");
      openDrawer();
      return;
    }
    setloading(true);
    const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/docdirectory/${docid}/reviews`;

    try {
      const index = UserData.picture.indexOf("=");
      const resultpic = UserData.picture.slice(0, index);
      let savereview = await axios.post(url, {
        ...reviewpayload,
        patientprofile: resultpic,
        patientName: UserData?.name,
        patientemail: UserData?.email,
      });
      setsnackmsg("Your Review Saved Sucessfully!");
      setseverity("success");
      setshowsnackbar(true);
      setloading(false);
      settempreview(null);
      GetReviews();
    } catch (error) {
      console.log("Err", error);
      setsnackmsg("Something went wrong..");
      setseverity("error");
      setloading(false);
      settempreview(null);
      setshowsnackbar(true);
    }
  };

  const [reviewpayload, setreviewpayload] = useState({});
  const [doctimings, setdoctimings] = useState({});
  const [istimetstring, setistimetstring] = useState(false);
  useEffect(() => {
    console.log(item, "docdata");
    convertStringToObject(item?.timeing);
  }, []);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const getToday = () => {
    const today = new Date().getDay(); // Returns a number (0-6) where 0 is Sunday and 6 is Saturday

    return daysOfWeek[today]; // Maps the number to the corresponding day name
  };

  const convertStringToObject = (dataString) => {
    // Replace the keys and values with quotes to make it valid JSON-like
    console.log(dataString, "timing");
    if (typeof dataString == "string") {
      const validJsonString = dataString
        ?.replace(/([a-zA-Z]+):/g, '"$1":') // Add quotes around day names
        ?.replace(/([0-9]+-[0-9]+ [ap]m|Closed)/g, '"$1"'); // Add quotes around times or 'Closed'

      try {
        // Parse the resulting string into an object
        const parsedSchedule = JSON.parse(validJsonString);
        console.log(parsedSchedule, "timiingvalid");
        // Update state with the parsed object
        setdoctimings(parsedSchedule);
        return parsedSchedule;
      } catch (error) {
        console.log("Invalid string format:", dataString);
        if (dataString == "") {
          setdoctimings("");
          return;
        }
        setdoctimings(dataString);
        setistimetstring(true);
      }
    } else if (typeof dataString == "object") {
      console.log("objecthai");

      setistimetstring(false);
      setdoctimings(dataString);
    }
  };
  const toast = useRef();
  const [showFullAddress, setShowFullAddress] = useState(false);
  return (
    <div>
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
      {/* 
      <Snackbar
        open={snackbarshow}
        autoHideDuration={4000}
        onClose={() => setsnackbarshow(false)}
      >
        <Alert
          onClose={() => setsnackbarshow(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarmsg}
        </Alert>
      </Snackbar> */}
      <Toast ref={toast} />
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
          border: "1.5px solid #f1f5f9",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          margin: "0.5rem 0",
          maxWidth: 370,
          width: isMobile ? "100vw" : "23rem",
          minHeight: "22rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        key={key}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 10,
          }}
        >
          {/* Name and Specialty */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.18rem",
                color: "#222",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
              title={item.name}
            >
              {item.name}
            </div>
            <div
              style={{
                color: "#6b7280",
                fontWeight: 500,
                fontSize: "1.01rem",
                marginTop: 2,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
              title={item.specialist}
            >
              {item.specialist}
            </div>
          </div>
          {/* Rating and Share */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {item.averageRating && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#fef3c7",
                  color: "#d97706",
                  borderRadius: "999px",
                  fontSize: "1.01rem",
                  fontWeight: 700,
                  padding: "0.18rem 0.8rem",
                  gap: "0.3rem",
                  boxShadow: "0 1px 4px #fde68a44",
                }}
              >
                <i
                  className="pi pi-star-fill"
                  style={{ fontSize: "1.1rem" }}
                ></i>
                {item.averageRating.toFixed(1)}
              </span>
            )}
            <button
              onClick={() => {
                let link = "https://ayum.in/doctor?docid=" + item._id;
                setlinktext(link);
                setsharemodal(true);
              }}
              style={{
                background: "rgba(0,128,128,0.07)",
                border: "none",
                color: "#009688",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: "pointer",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.18s",
              }}
              title="Share"
            >
              <i className="pi pi-share-alt" style={{ fontSize: "1.1rem" }}></i>
            </button>
          </div>
        </div>

        {/* Info Rows */}
        <div
          style={{
            margin: "1.2rem 0 0.5rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.7rem",
          }}
        >
          {/* Phone */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#222",
              fontSize: "1.07rem",
              gap: 10,
            }}
          >
            <i
              className="pi pi-phone"
              style={{ color: "#009688", fontSize: "1.1rem" }}
            />
            <span style={{ color: "#444", fontWeight: 500, marginLeft: 6 }}>
              {item.phone || "Not available"}
            </span>
          </div>
          {/* Timings */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#222",
              fontSize: "1.07rem",
              gap: 10,
            }}
          >
            <i
              className="pi pi-clock"
              style={{ color: "#009688", fontSize: "1.1rem" }}
            />
            <span style={{ color: "#222", fontWeight: 500 }}>
              {doctimings && !istimetstring
                ? Object.values(doctimings)[0]
                : item.timeing || "Not available"}
            </span>
          </div>
          {/* Address */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#222",
              fontSize: "1.07rem",
              gap: 10,
            }}
          >
            <i
              className="pi pi-map-marker"
              style={{ color: "#009688", fontSize: "1.1rem" }}
            />
            <span style={{ color: "#444", fontWeight: 500 }}>
              {item.address ? (
                showFullAddress || item.address.length <= 28 ? (
                  item.address
                ) : (
                  <>
                    {item.address.slice(0, 28)}...
                    <span
                      style={{
                        color: "#009688",
                        cursor: "pointer",
                        marginLeft: 4,
                        fontWeight: 600,
                      }}
                      onClick={() => setShowFullAddress(true)}
                    >
                      See more
                    </span>
                  </>
                )
              ) : (
                "No address added"
              )}
              {showFullAddress && item.address && item.address.length > 28 && (
                <span
                  style={{
                    color: "#009688",
                    cursor: "pointer",
                    marginLeft: 8,
                    fontWeight: 600,
                  }}
                  onClick={() => setShowFullAddress(false)}
                >
                  See less
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1.5px solid #f1f5f9",
            margin: "1.2rem 0 1.1rem 0",
          }}
        />

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <a
            href={
              item?.maplinkurl
                ? item.maplinkurl
                : `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
            }
            target="_blank"
            rel="noreferrer"
            style={{ flex: 1, textDecoration: "none" }}
          >
            <button
              style={{
                width: "100%",
                background: "#fff",
                color: "#009688",
                border: "1.5px solid #e0f2f1",
                borderRadius: "12px",
                height: "48px",
                fontWeight: 700,
                fontSize: "1.09rem",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,128,128,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <i className="pi pi-map-marker" style={{ fontSize: "1.1em" }} />
              View Map
            </button>
          </a>
          <button
            style={{
              flex: 1,
              background: "#009688",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              height: "48px",
              fontWeight: 700,
              fontSize: "1.09rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,128,128,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onClick={() => {
              const splitArray = item?.phone && item?.phone.split(/[,\s]+/);
              setselectedphones(splitArray);
              setcallmodal(true);
            }}
          >
            <i className="pi pi-phone" style={{ fontSize: "1.1em" }} />
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectoryCard;

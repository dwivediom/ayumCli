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
import {
  FaWhatsapp,
  FaCopy,
  FaTwitter,
  FaFacebook,
  FaTelegram,
} from "react-icons/fa";
import { InputTextarea } from "primereact/inputtextarea";
import { FaUser, FaStar } from "react-icons/fa";

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

  // Share handlers
  const shareOptions = [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp color="#25D366" size={22} />,
      onClick: () => {
        const message = `Get ${item.name} info on Ayum, Click the link below 👇👇\n${linktext}`;
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
          "_blank"
        );
        setsharemodal(false);
      },
    },
    {
      label: "Copy Link",
      icon: <FaCopy color="#555" size={22} />,
      onClick: () => {
        navigator.clipboard.writeText(linktext);
        setcpied(true);
        setTimeout(() => setcpied(false), 1500);
      },
    },
    {
      label: "Twitter",
      icon: <FaTwitter color="#1DA1F2" size={22} />,
      onClick: () => {
        const text = `Check out ${item.name} on Ayum: ${linktext}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          "_blank"
        );
        setsharemodal(false);
      },
    },
    {
      label: "Facebook",
      icon: <FaFacebook color="#1877F3" size={22} />,
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            linktext
          )}`,
          "_blank"
        );
        setsharemodal(false);
      },
    },
    {
      label: "Telegram",
      icon: <FaTelegram color="#0088cc" size={22} />,
      onClick: () => {
        const text = `Check out ${item.name} on Ayum: ${linktext}`;
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            linktext
          )}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
        setsharemodal(false);
      },
    },
  ];

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Handler for card click (list mode)
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on a button or link
    if (
      e.target.closest("button") ||
      e.target.closest("a") ||
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "A"
    ) {
      return;
    }
    router.push(`/doctor?docid=${item._id}`);
  };

  const phoneNumbers = item?.phone
    ? String(item?.phone)
        ?.split(/[,\s]+/)
        .filter(Boolean)
    : [];
  const [showPhoneModal, setShowPhoneModal] = useState(false);

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
      {docid ? (
        <>
          {/* --- BEGIN: DETAILED DOCTOR PROFILE PAGE --- */}
          {/* Head, main info, actions, review section, modals */}
          {/* (all your detailed doctor profile JSX here, including review section and modals) */}
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
                  <i
                    className="pi pi-share-alt"
                    style={{ fontSize: "1.1rem" }}
                  ></i>
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
                  {showFullAddress &&
                    item.address &&
                    item.address.length > 28 && (
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
                  <i
                    className="pi pi-map-marker"
                    style={{ fontSize: "1.1em" }}
                  />
                  View Map
                </button>
              </a>
              <a
                href={
                  phoneNumbers.length === 1 ? `tel:${phoneNumbers[0]}` : "#"
                }
                style={{ flex: 1, textDecoration: "none" }}
                onClick={(e) => {
                  if (!item?.phone) {
                    e.preventDefault();
                    setsnackmsg(
                      lang === "hi"
                        ? "फोन नंबर उपलब्ध नहीं है!"
                        : "Phone number not available!"
                    );
                    setseverity("error");
                    setshowsnackbar(true);
                  } else if (phoneNumbers.length > 1) {
                    e.preventDefault();
                    setShowPhoneModal(true);
                  }
                }}
              >
                <button
                  style={{
                    width: "100%",
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
                >
                  <i className="pi pi-phone" style={{ fontSize: "1.1em" }} />
                  {lang === "hi" ? "कॉल करें" : "Call Now"}
                </button>
              </a>
            </div>

            {/* Review Section */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1rem",
                marginBottom: "1rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  margin: "0 0 0.8rem 0",
                  color: "#333",
                }}
              >
                Reviews & Ratings
              </h2>

              {/* Show user's review if already given */}
              {reviewgiven ? (
                <div
                  style={{
                    background: "#e8f5e9",
                    borderRadius: "10px",
                    padding: "0.8rem",
                    marginBottom: "0.8rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.8rem",
                  }}
                >
                  <div
                    style={{
                      background: "#009688",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {reviewgiven.patientName?.[0] || "U"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: "0.95rem",
                      }}
                    >
                      Your Review
                    </div>
                    <div
                      style={{
                        color: "#666",
                        fontSize: "0.9rem",
                        margin: "0.2rem 0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            style={{
                              color:
                                i < reviewgiven.rating ? "#FFD700" : "#e0e0e0",
                              fontSize: "0.9rem",
                            }}
                          />
                        ))}
                        <span style={{ marginLeft: "0.3rem", fontWeight: 600 }}>
                          {reviewgiven.rating}/5
                        </span>
                      </div>
                      {reviewgiven.message}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  style={{
                    background: "#009688",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.7rem 1rem",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    marginBottom: "0.8rem",
                    boxShadow: "0 2px 8px rgba(0,128,128,0.10)",
                  }}
                  onClick={() => setShowReviewModal(true)}
                >
                  Give a Review
                </button>
              )}

              {/* List of reviews */}
              <div style={{ marginTop: "0.8rem" }}>
                {reviews && reviews.length > 0 ? (
                  <div>
                    {(showAllReviews ? reviews : reviews.slice(0, 3)).map(
                      (review, idx) => (
                        <div
                          key={idx}
                          style={{
                            borderBottom:
                              idx !== reviews.length - 1
                                ? "1px solid #f1f5f9"
                                : "none",
                            padding: "0.6rem 0",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.8rem",
                          }}
                        >
                          <div
                            style={{
                              background: review.patientprofile
                                ? "transparent"
                                : "#e0f7fa",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              color: review.userprofile
                                ? "transparent"
                                : "#009688",
                              fontSize: "1rem",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            {review.userprofile ? (
                              <img
                                src={review.userprofile.replace(/=s\d+-c/, "")}
                                alt={review.patientName || "User"}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              review.patientName?.[0] || "U"
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#333",
                                fontSize: "0.95rem",
                              }}
                            >
                              {review.name || "User"}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                margin: "0.2rem 0",
                              }}
                            >
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  style={{
                                    color:
                                      i < review.rating ? "#FFD700" : "#e0e0e0",
                                    fontSize: "0.85rem",
                                  }}
                                />
                              ))}
                              <span
                                style={{
                                  marginLeft: "0.3rem",
                                  color: "#666",
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                }}
                              >
                                {review.rating}/5
                              </span>
                            </div>
                            <div
                              style={{
                                color: "#666",
                                fontSize: "0.9rem",
                                margin: "0.2rem 0",
                                lineHeight: 1.4,
                              }}
                            >
                              {review.message}
                            </div>
                            <div
                              style={{
                                color: "#aaa",
                                fontSize: "0.8rem",
                                marginTop: "0.2rem",
                              }}
                            >
                              {review.createdAt
                                ? formatDate(review.createdAt)
                                : ""}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    {reviews.length > 3 && !showAllReviews && (
                      <button
                        style={{
                          background: "none",
                          color: "#009688",
                          border: "none",
                          fontWeight: 600,
                          cursor: "pointer",
                          marginTop: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                        onClick={() => setShowAllReviews(true)}
                      >
                        Show all reviews ({reviews.length})
                      </button>
                    )}
                    {showAllReviews && (
                      <button
                        style={{
                          background: "none",
                          color: "#009688",
                          border: "none",
                          fontWeight: 600,
                          cursor: "pointer",
                          marginTop: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                        onClick={() => setShowAllReviews(false)}
                      >
                        Show less
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.95rem",
                      textAlign: "center",
                      padding: "1rem 0",
                    }}
                  >
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>
            </div>

            {/* Review Modal */}
            <Dialog
              visible={showReviewModal}
              onHide={() => setShowReviewModal(false)}
              style={{ width: "90vw", maxWidth: 400 }}
              modal
              dismissableMask
              showHeader={false}
            >
              <div style={{ padding: "1.5rem" }}>
                <h3
                  style={{ margin: 0, marginBottom: "1rem", fontWeight: 700 }}
                >
                  Give a Review
                </h3>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ fontWeight: 600, color: "#333" }}>
                    Your Rating:
                  </span>
                  <div style={{ marginTop: 8 }}>
                    <Rating
                      value={newReview.rating}
                      cancel={false}
                      onChange={(e) => {
                        setNewReview({ ...newReview, rating: e.value });
                        setreviewpayload({ ...reviewpayload, rating: e.value });
                      }}
                      stars={5}
                      style={{ fontSize: "1.5rem" }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ fontWeight: 600, color: "#333" }}>
                    Your Review:
                  </span>
                  <InputTextarea
                    autoResize
                    rows={3}
                    cols={30}
                    value={newReview.message}
                    onChange={(e) => {
                      setNewReview({ ...newReview, message: e.target.value });
                      setreviewpayload({
                        ...reviewpayload,
                        message: e.target.value,
                      });
                    }}
                    style={{
                      width: "100%",
                      marginTop: 8,
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      padding: "0.7rem",
                      fontSize: "1rem",
                    }}
                    placeholder="Write your experience..."
                  />
                </div>
                <Button
                  label={loading ? "Submitting..." : "Submit Review"}
                  icon="pi pi-check"
                  onClick={handleSubmit}
                  disabled={loading || !newReview.rating || !newReview.message}
                  style={{
                    width: "100%",
                    background: "#009688",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    marginTop: "1rem",
                  }}
                />
              </div>
            </Dialog>
          </div>
        </>
      ) : (
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
            cursor: "pointer",
          }}
          key={key}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Name and Specialty */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                width: "fit-content",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "fit-content",
              }}
            >
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
                <i
                  className="pi pi-share-alt"
                  style={{ fontSize: "1.1rem" }}
                ></i>
              </button>
            </div>
          </div>

          <div onClick={handleCardClick}>
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
                  {showFullAddress &&
                    item.address &&
                    item.address.length > 28 && (
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
                  <i
                    className="pi pi-map-marker"
                    style={{ fontSize: "1.1em" }}
                  />
                  View Map
                </button>
              </a>
              <a
                href={
                  phoneNumbers.length === 1 ? `tel:${phoneNumbers[0]}` : "#"
                }
                style={{ flex: 1, textDecoration: "none" }}
                onClick={(e) => {
                  if (!item?.phone) {
                    e.preventDefault();
                    setsnackmsg(
                      lang === "hi"
                        ? "फोन नंबर उपलब्ध नहीं है!"
                        : "Phone number not available!"
                    );
                    setseverity("error");
                    setshowsnackbar(true);
                  } else if (phoneNumbers.length > 1) {
                    e.preventDefault();
                    setShowPhoneModal(true);
                  }
                }}
              >
                <button
                  style={{
                    width: "100%",
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
                >
                  <i className="pi pi-phone" style={{ fontSize: "1.1em" }} />
                  {lang === "hi" ? "कॉल करें" : "Call Now"}
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal - MOVED OUTSIDE CONDITIONAL RENDERING */}
      <Dialog
        visible={sharemodal}
        onHide={() => setsharemodal(false)}
        position="bottom"
        style={{ width: "100%", maxWidth: 400, margin: 0 }}
        modal
        dismissableMask
        className="p-dialog-bottom-sheet"
        showHeader={false}
        contentStyle={{ padding: 0, borderRadius: "16px 16px 0 0" }}
      >
        <div
          style={{
            padding: "1.5rem 1.2rem",
            borderRadius: "16px 16px 0 0",
            background: "#fff",
            boxShadow: "0 -2px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.15rem",
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            Share Doctor Profile
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {shareOptions.map((opt, idx) => (
              <button
                key={opt.label}
                onClick={opt.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "#f7f7f7",
                  border: "none",
                  borderRadius: 10,
                  padding: "0.7rem 1rem",
                  fontSize: "1.07rem",
                  fontWeight: 600,
                  color: "#222",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                {opt.icon}
                {opt.label}
                {opt.label === "Copy Link" && copied && (
                  <span
                    style={{
                      color: "#009688",
                      marginLeft: 10,
                      fontWeight: 500,
                      fontSize: 13,
                    }}
                  >
                    Copied!
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setsharemodal(false)}
            style={{
              marginTop: 22,
              width: "100%",
              background: "#fff",
              color: "#009688",
              border: "1.5px solid #e0f2f1",
              borderRadius: "12px",
              height: "44px",
              fontWeight: 700,
              fontSize: "1.09rem",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,128,128,0.07)",
              display: "block",
            }}
          >
            Cancel
          </button>
        </div>
      </Dialog>

      {/* Phone Number Modal */}
      <Dialog
        visible={showPhoneModal}
        onHide={() => setShowPhoneModal(false)}
        position="bottom"
        style={{ width: "100%", maxWidth: 400, margin: 0 }}
        modal
        dismissableMask
        showHeader={false}
        contentStyle={{ padding: 0, borderRadius: "16px 16px 0 0" }}
      >
        <div
          style={{
            padding: "1.5rem 1.2rem",
            borderRadius: "16px 16px 0 0",
            background: "#fff",
            boxShadow: "0 -2px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.15rem",
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            {lang === "hi"
              ? "कॉल करने के लिए नंबर चुनें"
              : "Select a number to call"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {phoneNumbers.map((num, idx) => (
              <a
                key={num}
                href={`tel:${num}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "#f7f7f7",
                  border: "none",
                  borderRadius: 10,
                  padding: "0.7rem 1rem",
                  fontSize: "1.07rem",
                  fontWeight: 600,
                  color: "#222",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onClick={() => setShowPhoneModal(false)}
              >
                <i
                  className="pi pi-phone"
                  style={{ color: "#009688", fontSize: "1.1em" }}
                />
                {num}
              </a>
            ))}
          </div>
          <button
            onClick={() => setShowPhoneModal(false)}
            style={{
              marginTop: 22,
              width: "100%",
              background: "#fff",
              color: "#009688",
              border: "1.5px solid #e0f2f1",
              borderRadius: "12px",
              height: "44px",
              fontWeight: 700,
              fontSize: "1.09rem",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,128,128,0.07)",
              display: "block",
            }}
          >
            {lang === "hi" ? "रद्द करें" : "Cancel"}
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default DirectoryCard;

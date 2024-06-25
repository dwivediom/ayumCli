import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Phonebook.module.css";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  List,
  ListItem,
  Modal,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { AccountContext } from "../context/AccountProvider";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Router, { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Head from "next/head";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { StarBorder } from "@mui/icons-material";
import Image from "next/image";
import axios from "axios";
import { calculateAverageRating, formatDate } from "../public/utils/Utils";
import HindiRating from "../public/locales/hi/reviewoption";
import EnglishRating from "../public/locales/en/reviewoption";
import LoginPopup from "./UserAuth/LoginPopup";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#FFC100",
  },
  "& .MuiRating-iconHover": {
    color: "#FFC100",
  },
});

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
    const checkIsMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkIsMobile();
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

  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const initialReviews = [
    {
      rating: 5,
      message: "Excellent service, highly recommend!",
      username: "john_doe",
      createdDate: "2024-05-01",
    },
    {
      rating: 4,
      message: "Very good experience overall.",
      username: "jane_smith",
      createdDate: "2024-05-03",
    },
    {
      rating: 3,
      message: "Average service, could be improved.",
      username: "sam_jones",
      createdDate: "2024-05-05",
    },
    {
      rating: 5,
      message: "Outstanding work, exceeded expectations!",
      username: "alice_brown",
      createdDate: "2024-05-07",
    },
    {
      rating: 2,
      message: "Not satisfied, needs a lot of improvement.",
      username: "mike_davis",
      createdDate: "2024-05-09",
    },
    {
      rating: 4,
      message: "Good service, will use again.",
      username: "susan_white",
      createdDate: "2024-05-11",
    },
    {
      rating: 5,
      message: "Fantastic experience, highly skilled!",
      username: "emma_wilson",
      createdDate: "2024-05-13",
    },
    {
      rating: 3,
      message: "It was okay, nothing special.",
      username: "chris_taylor",
      createdDate: "2024-05-15",
    },
    {
      rating: 4,
      message: "Very professional and timely.",
      username: "linda_martin",
      createdDate: "2024-05-17",
    },
    {
      rating: 1,
      message: "Terrible experience, would not recommend.",
      username: "peter_thomas",
      createdDate: "2024-05-19",
    },
  ];
  const [reviews, setReviews] = useState([]);
  const [reviewgiven, setreviewgiven] = useState();
  const [tempreview, settempreview] = useState(false);
  const [loading, setloading] = useState(false);
  const GetReviews = async () => {
    setloading(true);
    try {
      const allreviews = await axios({
        url: `${process.env.NEXT_PUBLIC_B_PORT}/api/docdirectory/${docid}/reviews`,
        method: "get",
      });
      console.log(allreviews, "allreview");
      setReviews(allreviews?.data?.reviews);
      const UserData = JSON.parse(localStorage.getItem("labuser"));
      const foundReview = allreviews?.data?.reviews?.find((obj) => {
        return obj["patientemail"] === UserData?.email;
      });
      setreviewgiven(foundReview);
      setloading(false);
    } catch (error) {
      setloading(false);
      return error.message;
    }
  };

  useEffect(() => {
    if (docid) {
      GetReviews();
    }
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
            },Phone-${item.phone?.slice(0, 5)}...  ${
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
      <div
        // style={{
        //   minHeight: showreview && "32rem",
        // }}
        className={`${styles.directorysubshell}`}
      >
        <div
          style={{
            height: show ? "fit-content" : "100%",
            minHeight: showreview && "32rem",

            width:
              isMobile && showreview
                ? "100%"
                : !isMobile && !showreview && "23rem",
            margin: isMobile && !showreview && "auto",
            borderBottomLeftRadius: showreview && isMobile && "0",
            borderBottomRightRadius: "0px",
            borderTopRightRadius: showreview && isMobile && "24px",
            borderRadius: !showreview && "24px",
            // width: router.query.docid && "95%",
            // margin: "auto",
          }}
          key={key}
          className={`${styles.directorycard}`}
        >
          <Snackbar
            open={showsnackbar}
            autoHideDuration={6000}
            onClose={() => {
              setshowsnackbar(false);
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            key={"top" + "right"}
          >
            <Alert
              onClose={() => setshowsnackbar(false)}
              severity={severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackmsg}
            </Alert>
          </Snackbar>
          <Modal
            open={sharemodal}
            onClose={() => {
              setcpied(false);
              setsharemodal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ padding: "0" }}
          >
            <Box sx={style}>
              <div
                onClick={() => {
                  shareOnWhatsApp(item?.name);
                }}
                className={`${styles.shareonwhatsapp}`}
              >
                Share On{" "}
                <WhatsAppIcon
                  style={{ color: "white", width: "35px", height: "35px" }}
                />
              </div>
              <div className={`${styles.copylinkdiv}`}>
                <div className={`${styles.copylink}`}>
                  {" "}
                  <div>{linktext}</div>
                </div>
                <span onClick={() => copyToClipboard(linktext)}>
                  <ContentCopyIcon style={{ width: "20px", height: "20px" }} />{" "}
                  {copied ? "Copied" : "Copy"}
                </span>
              </div>
            </Box>
          </Modal>
          <Modal
            open={callmodal}
            onClose={() => setcallmodal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ padding: "0" }}
          >
            <Box sx={style}>
              {selectedphones?.length > 0 &&
                selectedphones.map((item, index) => {
                  return (
                    item &&
                    item != "" && (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className={`${styles.callitem}`}
                      >
                        <div>{item} </div>
                        <Button
                          style={{
                            background: "#005e6d",
                            borderRadius: "4px",
                            padding: "4px 10px",
                          }}
                          variant="contained"
                          startIcon={<CallIcon style={{ color: "white" }} />}
                          onClick={() => {
                            handleCall(item);
                          }}
                        >
                          Call
                        </Button>{" "}
                      </div>
                    )
                  );
                })}
            </Box>
          </Modal>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              // width: router.query.docid && "fit-content",
              // gap: router.query.docid && "1rem",
            }}
          >
            {/* <div
        //   style={{
        //     display: "flex",
        //     gap: "2px",
        //     alignItems: "center",
        //     background: "rgb(0, 127, 147,0.3)",
        //     borderRadius: "24px",
        //     color: "black",
        //     padding: "3px 8px",
        //   }}
        // >
        
        //   <svg
        //     xmlns="http://www.w3.org/2000/svg"
        //     fill="none"
        //     viewBox="0 0 26 26"
        //     stroke-width="1.5"
        //     stroke="currentColor"
        //     class="w-6 h-6"
        //   >
        //     <path
        //       strokeLinecap="round"
        //       stroke-linejoin="round"
        //       d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        //     />
        //     <path
        //       strokeLinecap="round"
        //       stroke-linejoin="round"
        //       d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        //     />
        //   </svg>
        //   {item.city}
        // </div>{" "} */}
            <span
              style={{
                display: "flex",
                padding: "3px 10px",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
              }}
              class="bg-cyan-100 text-cyan-900 text-xs font-medium me-2 rounded-full dark:bg-cyan-100 dark:text-cyan-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 26 26"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>{" "}
              {item.city}
            </span>
            <span
              style={{
                display: "flex",
                padding: "3px 10px",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                cursor: "pointer",
              }}
              onClick={() => {
                // let link = isLocal ? "http://localhost:3000" : "https://ayum.in";
                let link = "https://ayum.in";
                link = link + "/doctor";
                link = link + "?docid=" + item._id + "&n=" + item.name;
                setlinktext(link);
                setsharemodal(true);
              }}
              class="bg-cyan-100 text-cyan-900 text-xs font-medium me-2 rounded-full dark:bg-cyan-100 dark:text-cyan-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                focusable="false"
                style={{
                  pointerEvents: "none",
                  display: "inherit",
                  width: "100%",
                  height: "100%",
                }}
              >
                <path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z" />
              </svg>
              Share
            </span>
          </div>
          <div className={`${styles.carddeatilbox}`}>
            <div
              // style={{ boxShadow: "inset 1px 1px 5px rgba(0,0,0,0.2)" }}
              onClick={() => {
                if (router.pathname != "/doctor")
                  router.push(`/doctor?docid=${item._id}&n=${item.name}`);
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div className={`${styles.cardname}`}>{item.name} </div>{" "}
                {calculateAverageRating(item.reviews ? item.reviews : []) >
                0 ? (
                  <span className={`${styles.reviewbadge}`}>
                    {calculateAverageRating(item.reviews ? item.reviews : [])}{" "}
                    <StarIcon
                      style={{
                        fontSize: "20px",
                        fill: "white",
                      }}
                      fontSize="inherit"
                    />
                  </span>
                ) : (
                  <span className={`${styles.reviewbadgenotrated}`}>
                    Not rated yet
                  </span>
                )}
              </div>
              <div>
                {" "}
                <span className="font-bold">Phone :</span> {item.phone}
              </div>

              <div>
                <span className="font-bold">Time :</span> {item.timeing}
              </div>
              <div>
                <span className="font-bold">Specialist :</span>{" "}
                {item.specialist}{" "}
              </div>
              {/* <div className={`${styles.showmorebox}`}>
          <span onClick={() => setShow(!show)} className={`${styles.showmore}`}>
            {show ? "Hide details" : "More details..."}{" "}
            <span className="text-lg">&#x2193;</span>
          </span>
        </div> */}

              <div style={{ maxWidth: "23rem" }}>
                <span className="font-bold">Address :</span> {item.address}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // width: router.query.docid && "fit-content",
                // gap: router.query.docid && "1rem",
              }}
            >
              <Button
                style={{
                  background: "#005e6d",
                  borderRadius: "4px",
                  padding: "4px 10px",
                }}
                variant="contained"
                startIcon={<CallIcon style={{ color: "white" }} />}
                onClick={() => {
                  // handleCall(item?.phone);
                  const splitArray = item?.phone && item?.phone.split(/[,\s]+/);
                  setselectedphones(splitArray);
                  setcallmodal(true);
                }}
              >
                Call
              </Button>{" "}
              <a
                href={
                  item?.maplinkurl
                    ? item.maplinkurl
                    : `https://www.google.com/maps/search/?api=1&query=${`${item.latitude} , ${item.longitude}`}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  style={{
                    // background: "rgb(0, 127, 147)",
                    color: "rgb(0, 127, 147)",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    border: "1.5px solid rgb(0, 127, 147 , 0.6)",
                  }}
                  startIcon={
                    <LocationOnIcon style={{ color: "rgb(0, 127, 147)" }} />
                  }
                  variant="outlined"
                >
                  View On Map
                </Button>
              </a>
            </div>
            {/* <form action="#" onSubmit={() => {}}> */}

            {reviewgiven
              ? showreview &&
                (loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "2rem",
                    }}
                  >
                    <Image
                      src={"/loader.svg"}
                      width={30}
                      height={30}
                      alt="Loading..."
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: "1rem",
                      textAlign: "center",
                      fontSize: "1.02rem",
                      background: "#EDEDED",
                      borderRadius: "8px",
                      padding: "10px 6px",
                      fontWeight: "500",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgb(0, 119, 119)",
                      }}
                    >
                      <span>
                        {/* {reviewgiven.rating} */}
                        <StyledRating
                          name="customized-color"
                          defaultValue={reviewgiven.rating}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setreviewpayload({
                              ...reviewpayload,
                              rating: e.target.value,
                            });
                          }}
                          // getLabelText={(review.rating) =>
                          //   `value${} Heart${value !== 1 ? "s" : ""}`
                          // }
                          precision={0.5}
                          readOnly
                          icon={
                            <StarIcon
                              style={{ fontSize: "30px" }}
                              fontSize="inherit"
                            />
                          }
                          emptyIcon={
                            <StarBorder
                              style={{ fontSize: "30px" }}
                              fontSize="inherit"
                            />
                          }
                        />
                      </span>{" "}
                      <span>Rating Given By You</span>
                    </div>

                    {!tempreview && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "rgb(218, 218, 218)",
                          borderRadius: "4px",
                          width: "fit-content",
                          margin: "auto",
                          marginTop: "10px",
                          gap: "4px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          settempreview(reviewgiven);
                          setreviewgiven(null);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z"></path>
                        </svg>
                        Edit review
                      </div>
                    )}
                  </div>
                ))
              : showreview && (
                  <div>
                    <p>Review {item?.name}</p>
                    <StyledRating
                      name="customized-color"
                      defaultValue={0}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setreviewpayload({
                          ...reviewpayload,
                          rating: e.target.value,
                        });
                      }}
                      // getLabelText={(review.rating) =>
                      //   `value${} Heart${value !== 1 ? "s" : ""}`
                      // }
                      precision={0.5}
                      icon={
                        <StarIcon
                          style={{ fontSize: "30px" }}
                          fontSize="inherit"
                        />
                      }
                      emptyIcon={
                        <StarBorder
                          style={{ fontSize: "30px" }}
                          fontSize="inherit"
                        />
                      }
                    />
                    {reviewpayload?.rating && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexWrap: "wrap",
                          gap: "5px",
                        }}
                      >
                        {lang == "hi"
                          ? HindiRating.map((rev) => {
                              if (rev.rating == reviewpayload?.rating) {
                                return rev.comments.map((com) => {
                                  return (
                                    <p
                                      style={{
                                        padding: "3px 10px",
                                        border: "1px solid #005E6D",
                                        fontSize: "13px",
                                        borderRadius: "24px",
                                        color: "#005E6D",
                                      }}
                                      onClick={() => {
                                        setreviewpayload({
                                          ...reviewpayload,
                                          comment: com,
                                        });
                                      }}
                                    >
                                      {com}
                                    </p>
                                  );
                                });
                              }
                            })
                          : EnglishRating.map((rev) => {
                              if (rev.rating == reviewpayload.rating) {
                                return rev.comments.map((com) => {
                                  return (
                                    <p
                                      style={{
                                        padding: "2px 5px",
                                        borderRadius: "24px",
                                        border: "1px solid #005E6D",
                                        fontSize: "13px",
                                        color: "#005E6D",
                                      }}
                                      onClick={() => {
                                        setreviewpayload({
                                          ...reviewpayload,
                                          comment: com,
                                        });
                                      }}
                                    >
                                      {com}
                                    </p>
                                  );
                                });
                              }
                            })}
                      </div>
                    )}
                    {reviewpayload.rating && (
                      <div
                        className={`${styles.reviewinput}`}
                        style={{ width: "100%", display: "flex" }}
                      >
                        <input
                          onChange={(e) => {
                            setreviewpayload({
                              ...reviewpayload,
                              comment: e.target.value,
                            });
                          }}
                          // disabled={!reviewpayload.rating}
                          value={reviewpayload?.comment || ""}
                          placeholder="Enter Your Review"
                        />{" "}
                        <span
                          onClick={() => {
                            if (reviewpayload?.rating) {
                              handleSubmit();
                            }
                          }}
                          style={{ color: "white", padding: "3px" }}
                        >
                          {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                          />
                        </svg> */}
                          Submit
                        </span>
                      </div>
                    )}

                    {tempreview && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "rgb(218, 218, 218)",
                          borderRadius: "4px",
                          width: "fit-content",
                          margin: "auto",
                          marginTop: "10px",
                          gap: "4px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setreviewgiven(tempreview);
                          settempreview(null);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                        </svg>
                        Close
                      </div>
                    )}
                  </div>
                )}

            {/* <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button> */}
            {/* </form> */}
            {/* {router.query?.docid && (
              <Box
                sx={{
                  width: 200,
                  display: "flex",
                  alignItems: "center",
                }}
              >
              
                <StyledRating
                  name="customized-color"
                  defaultValue={2}
                  getLabelText={(value) =>
                    `${value} Heart${value !== 1 ? "s" : ""}`
                  }
                  precision={0.5}
                  icon={
                    <StarIcon style={{ fontSize: "30px" }} fontSize="inherit" />
                  }
                  emptyIcon={
                    <StarBorder
                      style={{ fontSize: "30px" }}
                      fontSize="inherit"
                    />
                  }
                />
                {value !== null && (
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : value]}
                  </Box>
                )}
              </Box>
            )} */}
          </div>
        </div>
        {showreview && (
          <div
            style={{
              height: showreview && "32rem",
              overflow: "auto",
              borderRadius: isMobile && "0",
              width: isMobile ? "100%" : "25rem",
              minWidth: !isMobile && "21rem",
            }}
            className={`${styles.reviewshell}`}
          >
            <h3
              style={{
                textAlign: "center",
                fontWeight: "600",
                padding: "10px",
                position: "sticky",
                color: "#fff",
                top: "0",
                fontSize: "1.05rem",
                zIndex: "10",
                background: "#008f9f",
              }}
            >
              Reviews From Ayum User's
            </h3>
            <Container style={{ background: "rgb(245, 245, 245)" }}>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "20rem",
                    width: "100%",
                    paddingTop: "2rem",
                  }}
                >
                  <Image
                    src={"/loader.svg"}
                    width={30}
                    height={30}
                    alt="Loading..."
                  />
                </div>
              ) : (
                <>
                  <List>
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <Paper
                          key={index}
                          style={{
                            padding: "10px",
                            borderRadius: "18px",
                            marginBottom: "10px",
                          }}
                        >
                          {/* <ListItem>
            <Typography>
              <strong>Rating:</strong> {review.rating}
            </Typography>
          </ListItem> */}
                          <StyledRating
                            name="customized-color"
                            // defaultValue={2}
                            value={review.rating}
                            // getLabelText={(review.rating) =>
                            //   `value${} Heart${value !== 1 ? "s" : ""}`
                            // }
                            style={{
                              // width: "40%",
                              display: "flex",
                              justifyContent: "left",
                            }}
                            precision={0.5}
                            readOnly
                            icon={
                              <StarIcon
                                style={{ fontSize: "30px" }}
                                fontSize="inherit"
                              />
                            }
                            emptyIcon={
                              <StarBorder
                                style={{ fontSize: "30px" }}
                                fontSize="inherit"
                              />
                            }
                          />

                          <ListItem
                            style={{
                              display: "flex",
                              gap: "10px",
                              textAlign: "left",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                // alignItems: "center",
                                justifyContent: "space-between",
                                gap: "5px",
                                width: "100%",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  width: "100%",
                                }}
                              >
                                <img
                                  src={
                                    review?.patientprofile || "/deafaultpro.jpg"
                                  }
                                  style={{
                                    height: "35px",
                                    width: "35px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <Typography style={{ fontSize: "13px" }}>
                                    {review?.patientName}
                                  </Typography>{" "}
                                  <p
                                    style={{
                                      fontSize: "10px",
                                    }}
                                  >
                                    {formatDate(review?.createdAt)}
                                  </p>
                                </div>{" "}
                              </div>
                            </div>

                            <Typography style={{ fontSize: "14px" }}>
                              {review?.comment}
                            </Typography>
                            {/* <Chip
                              label={formatDate(review?.createdAt)}
                              color="success"
                              variant="outlined"
                            /> */}
                            {/* <p>{review.createdDate}</p> */}
                          </ListItem>

                          {/* <ListItem> */}

                          {/* </ListItem> */}

                          {/* <ListItem>
            <Typography>
              <strong>Date:</strong> {review.createdDate}
            </Typography>
          </ListItem> */}
                        </Paper>
                      ))
                    ) : (
                      <div
                        style={{
                          width: "20rem",
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEnElEQVR4nO2ZbUxTVxiAD3aDLPwYsqpDt2xhssQo4oBREwNmOihsCJgIKMOPxA2NZcmWbArbpBCXkMwYxsxm3XADXAF7LvSDUnSt9txOyQbVZR9hIEpBs68skmxLpobBu5xT2mG5wGovt/3RN3mT0/ecc+/z3HtPbu4pQuEIRzjCgXS2FYgjJQjzHyGOdyCODCOOjCGO3EUcD4gjfyBMfkMcfwVxfDviyNuo3b4eqWFRcK8eduS6gSnkfSTmf0SYFAUHXtcTe9/gvqnriZVeADsU4gnwacEQKBVR4CXpBThSJZoAR6qkF8CkQSwBGXfhlOT8sVrLJbEEHm/uuCK5wPJm/a9iCTzR1H5LcoGlWtNtsQTimo13JReIabFMiCWwmB5L6og7bZjMOPExlPFWeO+rc/D55W5wfN8Fg4NmuHm1E8audcK4y8SStmmN9tExdCydU8ZbgR6DHktyASiOB5YjpsCy2H2csIA/Ac6aF+Hghtui3YHK9L+htyYHSRXgrL4JfVUAH+y+B+bEgQ2gUaXPCivYf3wPQJ8awKm+Ia2As3oGIIXTlGfMKjBrv7NaYoHemhwmMayfDPgRcuknKDxcVmdLJuAVGTENBCwwYuyXHNwr4DJ+IoKAJngCo4bnRRDYFDQBJjFiuhAAPAkqPBMYNceDy/i7/4vXeAtuGFeiUAgYNmSAyzjmF/xoZzoKpRg8fyoJhrTzww+1wMGKV19DoRYKZX4jeyF9ewxg4FOA6zoAl8GdtE1rtM9ZDYqsvJ/XZmZGo1CJZ7PztiqU+VNv1PmTjk3L2lKOQiQi0pR5/X4LKPOHUCjEioraQgr0TMGO8W5H/bzwdExywfZxOuext2q3Bo+c7sxhcvFRdR27ok+VV0KiyQL/zAFP++iYlapDbM7Sd4/TT0oHwvZU6cAtliiE+ZMIk0n6PZuw7w0GI6/VsO/bBnJyVgHaR8d4pJ98/bBnY2sCYf5DpPshcmHhtXY5woSf/kGeWPIyg4nW6NjvZR02+LPvyAz4v3qPQJzeysY8XH+azVm1W+W7Q3cJGW3LFga+w/oI4siA745CcsEOBvNgc7e3prY1zRCgNU//Qw16NiepaM/MXQrM9yPtl4vFhQeIQJicFdoSSc3dxmAWtdm8tegOO/z0da0XnrZpzdP/gPYcm5OypVh4qwUTs7gCnH2n70kizpwH+dRipLnkwCFW8/TvPdvmFaBtTz2y0QwJ+93rRpFdAAn734TIpi4BEVIiDrxOJ0OYXPc9gVxVAU8nr4eUzS9AyqYc1qa1/zZsefiu5yhLmafWYoV123Z5pRVTmVS4C2StVt9H6ao4f0Fhx2ah2xyfkcWgz5i6odXYxdrx6Zn3jFF26Vl6fi9/5ygDTty+F6IazRD1WSesKXmF1eIOHxO6C88FLsDx9YICG90CbSYLtBjMboGNWXNuIa4pLWOwMXWN3lpMXROrrS7dJ7Sg3xdDoEcIxvMITU+5qnJOgdTcQgY7/XGRtX7Baqm5RUKL+aIYAr8IwbgXcQW76jRpe/oiFspvBq6x/L91RM8dcGD+zlxQ/qTfApi/E7hAONCCxr8pUjjJRsqE5QAAAABJRU5ErkJggg=="></img>
                        <h5> No Reviews Found!</h5>
                        <h6 style={{ color: "#005E6D", fontWeight: "600" }}>
                          Give your valuable review in just two Clicks
                        </h6>
                      </div>
                    )}
                  </List>
                </>
              )}
            </Container>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryCard;

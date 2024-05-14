import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Phonebook.module.css";
import { Alert, Box, Button, Modal, Snackbar, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { AccountContext } from "../context/AccountProvider";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useRouter } from "next/router";
import Head from "next/head";
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
const DirectoryCard = ({ item, key, docid }) => {
  const { lang } = useContext(AccountContext);

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
  return (
    <div>
      {docid && (
        <Head>
          <title>
            {`${item.name} , ${item.specialist}`} {"- Ayum"}{" "}
          </title>
          <meta
            name="Title"
            content={`${item.name} in ${item.address?.slice(0, 20)} - Best ${
              item.specialist
            } in ${item.city} ${item.address?.slice(0, 20)} - Ayum`}
          ></meta>
          <meta
            name="description"
            content={`${item.name}  in ${item.address?.slice(0, 20)}. Top ${
              item.specialist
            } Doctors ${item.address?.slice(
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

      <div
        style={{
          height: show && "fit-content",
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
              selectedphones.map((item) => {
                return (
                  item &&
                  item != "" && (
                    <div
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
              let link = "https://www.ayum.in";
              link = link + "/doctor";
              link = link + "?docid=" + item._id;
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
          <div className={`${styles.cardname}`}>{item.name}</div>
          <div>
            {" "}
            <span className="font-bold">Phone :</span> {item.phone}
          </div>

          <div>
            <span className="font-bold">Time :</span> {item.timeing}
          </div>
          <div>
            <span className="font-bold">Specialist :</span> {item.specialist}{" "}
          </div>
          {/* <div className={`${styles.showmorebox}`}>
          <span onClick={() => setShow(!show)} className={`${styles.showmore}`}>
            {show ? "Hide details" : "More details..."}{" "}
            <span className="text-lg">&#x2193;</span>
          </span>
        </div> */}

          <div
          // style={{ display: !show && "none" }}
          >
            <span className="font-bold">Address :</span> {item.address}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
              href={`https://www.google.com/maps/search/?api=1&query=${
                item.location
                  ? ` ${item.location.lat} , ${item.location.lon}`
                  : " , "
              }`}
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
        </div>
      </div>
    </div>
  );
};

export default DirectoryCard;

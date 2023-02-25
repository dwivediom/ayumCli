import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import styles from "../../styles/chat.module.css";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { downloadMedia } from "../../utils/downloadMedia";

// import { Accountcontext } from "../../context/AccountProvider";
// import { margin, padding } from "@mui/system";

import { formatTimestamp } from "../../utils/timeFormator";

const Message = (props) => {
  //   const { account } = useContext(Accountcontext);
  const [sender, setsender] = useState(false);
  const [senderstyle, setsenderstyle] = useState({});
  const [childstyle, setchildstyle] = useState({});
  const [time, settime] = useState("");
  const style1 = {
    display: "flex",
    alignItems: "flex-end",
  };
  const reciverChildstyle = {
    backgroundColor: "#E4E6EB",
    width: "max-content",
    maxWidth: "70%",
    padding: "5px",
    borderRadius: "8px",
    marginTop: "10px",
    // color: "white",
  };
  const senderChildelement = {
    backgroundColor: "#0084FF",
    width: "max-content",
    color: "white",
    maxWidth: "70%",
    padding: "5px",
    borderRadius: "8px",
    marginTop: "10px",
  };

  useEffect(() => {
    if (props.senderId === JSON.parse(localStorage.getItem("labuser")).sub) {
      setsender(true);
      setsenderstyle(style1);
      setchildstyle(senderChildelement);
    } else {
      setsenderstyle({});
      setchildstyle(reciverChildstyle);
    }
  }, []);
  useEffect(() => {
    const timestamp = new Date(props.time);
    const formattedTime = formatTimestamp(timestamp);
    settime(formattedTime);
    console.log(formattedTime); // output: "10:21, 19 February 2023"
  }, []);

  if (props.datatype == "file") {
    if (props.msgval.includes(".pdf") || props.msgval.includes(".txt")) {
      return (
        <div className="d-flex flex-col" style={senderstyle}>
          <div style={childstyle} className={`${styles.chatpdf}`}>
            <PictureAsPdfIcon
              style={{ width: "30px", height: "40px" }}
            ></PictureAsPdfIcon>
            <a style={{ display: "block" }} href={props.msgval}>
              {props.msgval.split("file-").pop()}{" "}
            </a>
            <br />

            <FileDownloadIcon
              style={{ cursor: "pointer" }}
              onClick={(e) => downloadMedia(e, props.msgval)}
            >
              {" "}
            </FileDownloadIcon>
          </div>
          <span style={{ fontSize: "0.6rem" }} className="text-gray-400 ">
            {time && time}
          </span>{" "}
        </div>
      );
    } else {
      return (
        <>
          <div className="d-flex flex-col" style={senderstyle}>
            <div style={childstyle}>
              <div>
                <Image
                  width={300}
                  height={300}
                  src={`${props.msgval}`}
                  style={{
                    objectFit: "cover",
                    display: "block",
                    backgroundPosition: "top",
                    borderRadius: "8px",
                  }}
                />
                <a style={{ display: "block" }} href={props.msgval}>
                  {props.msgval.split("file-").pop()}{" "}
                </a>

                <FileDownloadIcon
                  onClick={(e) => downloadMedia(e, props.msgval)}
                >
                  {" "}
                </FileDownloadIcon>
              </div>
            </div>

            <span
              style={{ fontSize: "0.6rem" }}
              className="text-gray-400 text-sm"
            >
              {time && time}
            </span>
          </div>
        </>
      );
    }
  } else {
    return (
      <div
        className={`d-flex flex-col ${styles.chattextbox} `}
        style={senderstyle}
      >
        <div style={childstyle} className={`${styles.chattxt}`}>
          <span>{props.msgval}</span> <br />
        </div>
        <span style={{ fontSize: "0.6rem" }} className="text-gray-400 text-sm">
          {time && time}
        </span>{" "}
      </div>
    );
  }
};

export default Message;

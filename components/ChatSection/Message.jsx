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

  const [showFullMessage, setShowFullMessage] = useState(false);
  const handleToggleMessage = () => {
    setShowFullMessage(!showFullMessage);
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

  const [isurl, setisurl] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [loadimg, setloadimg] = useState(false);

  useEffect(() => {
    async function checkmsg() {
      setloadimg(true);
      if (props.msgval.includes("google.com/maps/search/")) {
        setisurl(true);

        setloadimg(false);
      }
    }

    checkmsg();
  }, []);

  if (isurl) {
    return (
      <>
        <div className="d-flex flex-col " style={senderstyle}>
          {!loadimg ? (
            <>
              <a
                href={`${props.msgval}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-cyan-100 rounded-lg relative w-[200px] h-[200px]"
              >
                <Image
                  src={"/mapthumb.jpeg"}
                  alt={`Preview of ${props.msgval}`}
                  width={300}
                  layout="fill"
                  className="rounded-lg "
                  objectFit="cover"
                  objectPosition={"center"}
                  height={300}
                />
              </a>
              <a
                href={`${props.msgval}`}
                target="_blank"
                rel="noreferrer"
                className="message-content font-bold text-sm text-blue-600 underline"
              >
                Click for Location
              </a>
            </>
          ) : (
            <div className="p-2">
              <Image
                src={"/loader.svg"}
                width={30}
                height={30}
                alt="Loading..."
              />
            </div>
          )}
        </div>
      </>
    );
  }

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
          <div className="d-flex flex-col " style={senderstyle}>
            <div style={childstyle}>
              <div
                style={{
                  overflow: "hidden",
                }}
                className="relative w-[15rem] "
              >
                <div className="relative  h-[8rem]">
                  <Image
                    width={300}
                    height={300}
                    src={`${props.msgval}`}
                    alt={"message"}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"center"}
                  />
                </div>

                <a style={{ display: "block" }} href={props.msgval}>
                  {props.msgval.split("file-").pop()}
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
          {showFullMessage ? (
            <p>
              {props.msgval} <br />
              {props.msgval.length >= 200 && (
                <a
                  className="text-black cursor-pointer"
                  onClick={() => handleToggleMessage()}
                >
                  ...Hide
                </a>
              )}
            </p>
          ) : (
            <p>
              {props.msgval.substring(0, 200)} <br />
              {props.msgval.length >= 200 && (
                <a
                  className="cursor-pointer text-black font-bold text-sm"
                  onClick={() => handleToggleMessage()}
                >
                  ...Read More
                </a>
              )}
            </p>
          )}
        </div>
        <span style={{ fontSize: "0.6rem" }} className="text-gray-400 text-sm">
          {time && time}
        </span>
      </div>
    );
  }
};

export default Message;

import React, { useState, useContext, useEffect } from "react";
import { getuserId } from "../../routes/user";
import { AccountContext } from "../../context/AccountProvider";
import { setmessage } from "../../routes/message";
import { uploadFile } from "../../routes/file";
// import upload
import styles from "../../styles/newchat.module.css";
// import SendRoundedIcon from "@mui/icons-material/SendRounded";
// import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
import { notify, sendnotification } from "../../routes/notify";
import English from "../../public/locales/en/labtest";
import Hindi from "../../public/locales/hi/labtest";
import { validateAndCompressImage, isImageFile, createProgressCallback } from "../../utils/imageCompression";

const MsgInputSection = () => {
  const {
    account,
    person,
    setmsgchange,
    setAccount,
    msgchange,
    socket,
    setuplodedmsg,
    uplodedmsg,
    msgprivate,
    lang,
    msgopened,
  } = useContext(AccountContext);
  const [input, setinput] = useState();
  const [file, setfile] = useState("");
  const [image, setimage] = useState("");
  const [options, showoptions] = useState("");
  const [inputholder, setinputholder] = useState("");
  const [location, setLocation] = useState();
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [compressionProgress, setCompressionProgress] = useState(0);

  useEffect(() => {
    const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
    setAccount(localStoragedata);
  }, []);

  const getconst = async () => {
    if (file) {
      setUploading(true);
      setCompressing(false);
      setUploadProgress("");
      
      try {
        let fileToUpload = file;
        
        // Check if it's an image and needs compression
        if (isImageFile(file)) {
          setCompressing(true);
          setCompressionProgress(0);
          setUploadProgress(lang === "en" ? "Compressing image..." : "छवि संपीड़ित की जा रही है...");
          
          try {
            // Create progress callback for compression
            const progressCallback = createProgressCallback((progress) => {
              setCompressionProgress(progress);
              setUploadProgress(
                lang === "en" 
                  ? `Compressing image... ${Math.round(progress)}%`
                  : `छवि संपीड़ित की जा रही है... ${Math.round(progress)}%`
              );
            });

            const compressionResult = await validateAndCompressImage(file, undefined, progressCallback, true);
            fileToUpload = compressionResult.file;
            
            if (compressionResult.wasCompressed) {
              console.log(`Image compressed from ${compressionResult.originalSize} to ${compressionResult.compressedSize}`);
              console.log(`Original name: ${compressionResult.originalName}`);
              console.log(`New name: ${compressionResult.file.name}`);
            }
          } catch (compressionError) {
            console.error("Image compression failed:", compressionError);
            // Continue with original file if compression fails
          } finally {
            setCompressing(false);
            setCompressionProgress(0);
          }
        }

        setUploadProgress(lang === "en" ? "Uploading..." : "अपलोड हो रहा है...");
        
        let data = new FormData();
        data.append("name", fileToUpload.name);
        data.append("file", fileToUpload);
        console.log(" getcost workking ", data);
        const filedata = await uploadFile(data);
        console.log("filedata", filedata);
        setimage(filedata.data);
        console.log("imager", image);
        return filedata.data;
      } finally {
        setUploading(false);
        setCompressing(false);
        setUploadProgress("");
        setCompressionProgress(0);
      }
    }
  };

  const sendmsg = async (e) => {
    e && e.preventDefault();
    if (input == "") {
      return;
    }
    setinputholder(input);
    setinput("");

    if (!file) {
      let socketmsg = {
        senderId: account.sub,
        reciverId: person.user.sub,
        text: input,
        type: "text",
      };
      setmsgchange(socketmsg);
      socket.current.emit("sendMessage", socketmsg);
      msgprivate && setinput("");
    } else {
      let socketmsg = {
        senderId: account.sub,
        reciverId: person.user.sub,
        text: `... sending file ${input}`,
        type: "text",
      };
      let nomsg = {
        senderId: account.sub,
        reciverId: person.user.sub,
        text: ` can not send file in private`,
        type: "text",
      };
      if (msgprivate) {
        setmsgchange(nomsg);
        setinput(null);
        setimage("");
        setfile("");
      } else {
        setmsgchange(socketmsg);
        setinput(null);
      }
    }

    if (!msgprivate) {
      let data = await getuserId(account.sub, person.user.sub);
      let msg = {};

      if (!file) {
        msg = {
          conversationId: data.data._id,
          senderId: account.sub,
          reciverId: person.user.sub,
          text: input,
          type: "text",
        };
        await setmessage(msg);
      } else {
        const newfile = await getconst();
        msg = {
          conversationId: data.data._id,
          senderId: account.sub,
          reciverId: person.user.sub,
          text: newfile,
          type: "file",
        };
        setmsgchange(msg);
        await setmessage(msg);
        socket.current.emit("sendMessage", msg);
        setinput(null);
        setimage("");
        setuplodedmsg(!uplodedmsg);
        setfile("");
      }

      let holdinput = input;
      setinputholder("");
      setinput(null);

      // await notify({
      //   auth: person.user.auth,
      //   endpoint: person.user.endpoint,
      //   p256dh: person.user.p256dh,
      //   sender: account.name,
      //   message: holdinput,
      // });
      await sendnotification({
        title: `Message from ${account.name} `,
        body: holdinput,
        click_action: "https://ayum.in/ChatSection",
        icon: "https://ayum.in/icons/icon-96x96.png",
        to: person.user.FCMtoken,
      });
    }
  };

  const [mobile, setmobile] = useState(false);
  useEffect(() => {
    console.log(screen.width, "screen width hai");
    console.log(window.innerWidth, "windows width hai");
    if (window.innerWidth < 650) {
      setmobile(true);
    }

    return;
  }, []);
  const onfilechange = (e) => {
    console.log(e.target.files[0]);
    setfile(e.target.files[0]);
    console.log("first file ", file);
    setinput(e.target.files[0].name);
  };

  const getLocation = () => {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
      },
      (error) => {
        alert(`Failed to get your location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  };

  function shareLocation() {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            console.log(latitude, longitude);

            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=14`;
            setinput(url);
            // sendmsg();
          });
        } else if (permissionStatus.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=14`;
              setinput(url);
              // sendmsg();
            },
            () => {},
            { enableHighAccuracy: true }
          );
        }
      });
  }
  return (
    <>
      <div
        // onMouseLeave={() => showoptions(false)}
        style={{
          position: msgopened && mobile && "absolute",
        }}
        className={`${styles.chatinputbox}`}
      >
        <div className={`${styles.chatinput}`}>
          <form action="#" onSubmit={(e) => sendmsg(e)}>
            <input
              type="text"
              placeholder={
                lang == "en" ? English.sendmsgandrep : Hindi.sendmsgandrep
              }
              onChange={(e) => setinput(e.target.value)}
              value={input}
            />
          </form>
        </div>
        <div className={`${styles.sendactions}`}>
          {uploading && (
            <div style={{
              position: "absolute",
              top: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#e3f2fd",
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid #2196f3",
              fontSize: "12px",
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 1000,
              whiteSpace: "nowrap"
            }}>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: "12px" }}></i>
              <span>{uploadProgress}</span>
            </div>
          )}
          <div onClick={() => sendmsg()}>
            <img
              width="64"
              height="64"
              src="https://img.icons8.com/external-anggara-glyph-anggara-putra/64/4D4D4D/external-sent-communication-anggara-glyph-anggara-putra.png"
              alt="external-sent-communication-anggara-glyph-anggara-putra"
            />
          </div>
          <div onClick={() => showoptions(!options)}>
            {/* <AttachFileIcon
              style={{
                color: "black",
                width: "30px",
                height: "30px",
                display: options && "none",
              }}
            /> */}
            <img
              style={{
                display: !options && "none",
              }}
              width="30"
              height="30"
              src="https://img.icons8.com/ios-glyphs/30/FA5252/macos-close.png"
              alt="macos-close"
            />
          </div>
        </div>
        {options && (
          <div className={` ${styles.choosebox}`}>
            <label htmlFor="fileinput">
              {/* <FileCopyRoundedIcon style={{ color: "black" }} /> */}

              <input
                onChange={(e) => {
                  onfilechange(e);
                }}
                type="file"
                id="fileinput"
                className="hidden"
              />
            </label>
            <div onClick={() => shareLocation()}>
              {/* <LocationOnIcon style={{ color: "black" }} /> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MsgInputSection;

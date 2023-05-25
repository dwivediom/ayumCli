import React, { useState, useContext, useEffect } from "react";
import { getuserId } from "../../routes/user";
import { AccountContext } from "../../context/AccountProvider";
import { setmessage } from "../../routes/message";
import { uploadFile } from "../../routes/file";
// import upload
import styles from "../../styles/newchat.module.css";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { notify } from "../../routes/notify";
import English from "../../public/locales/en/labtest";
import Hindi from "../../public/locales/hi/labtest";

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

  useEffect(() => {
    const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
    setAccount(localStoragedata);
  }, []);

  const getconst = async () => {
    if (file) {
      let data = new FormData();
      data.append("name", file.name);
      data.append("file", file);
      console.log(" getcost workking ", data);
      const filedata = await uploadFile(data);
      console.log("filedata", filedata);
      setimage(filedata.data);
      console.log("imager", image);
      return filedata.data;
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

      await notify({
        auth: person.user.auth,
        endpoint: person.user.endpoint,
        p256dh: person.user.p256dh,
        sender: account.name,
        message: holdinput,
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
          <div onClick={() => sendmsg()}>
            <img
              width="64"
              height="64"
              src="https://img.icons8.com/external-anggara-glyph-anggara-putra/64/4D4D4D/external-sent-communication-anggara-glyph-anggara-putra.png"
              alt="external-sent-communication-anggara-glyph-anggara-putra"
            />
          </div>
          <div onClick={() => showoptions(!options)}>
            <AttachFileIcon
              style={{
                color: "black",
                width: "30px",
                height: "30px",
                display: options && "none",
              }}
            />
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
              <FileCopyRoundedIcon style={{ color: "black" }} />

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
              <LocationOnIcon style={{ color: "black" }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MsgInputSection;

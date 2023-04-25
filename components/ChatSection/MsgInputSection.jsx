import React, { useState, useContext, useEffect } from "react";
import { getuserId } from "../../routes/user";
import { AccountContext } from "../../context/AccountProvider";
import { setmessage } from "../../routes/message";
import { uploadFile } from "../../routes/file";
// import upload
import styles from "../../styles/chat.module.css";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { notify } from "../../routes/notify";

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
  } = useContext(AccountContext);
  const [input, setinput] = useState("");
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
      console.log(" getcost workking ");
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
        setinput("");
        setimage("");
        setfile("");
      } else {
        setmsgchange(socketmsg);
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
        setinput("");
        setimage("");
        setuplodedmsg(!uplodedmsg);
        setfile("");
      }

      let holdinput = input;
      setinputholder("");
      setinput(" ");

      await notify({
        auth: person.user.auth,
        endpoint: person.user.endpoint,
        p256dh: person.user.p256dh,
        sender: account.name,
        message: holdinput,
      });
    }
  };

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
        onMouseLeave={() => showoptions(false)}
        className={`${styles.chatinputbox}`}
      >
        <div>
          <form action="#" onSubmit={(e) => sendmsg(e)}>
            <input
              type="text"
              onChange={(e) => setinput(e.target.value)}
              value={input}
              placeholder="Send Message ..."
            />
          </form>
        </div>

        <div>
          <div className={`${styles.sendbtn}`} onClick={sendmsg}>
            <SendRoundedIcon style={{ color: "white" }} />
          </div>
        </div>

        <div onClick={() => showoptions(!options)}>
          <label className={`${styles.sendbtn}`}>
            <AttachFileIcon style={{ color: "white" }} />
          </label>
        </div>
        {options && (
          <div
            className={`absolute top-[-5rem] rounded-md flex gap-3 w-full px-2 py-5 ${styles.choosebox}`}
          >
            <div>
              <label htmlFor="fileinput" className={`${styles.sendbtn}`}>
                <FileCopyRoundedIcon style={{ color: "white" }} />
              </label>
              <input
                onChange={(e) => {
                  onfilechange(e);
                }}
                type="file"
                id="fileinput"
                className=" hidden  "
              />
            </div>
            <div onClick={() => shareLocation()}>
              <label htmlFor="location" className={`${styles.sendbtn}`}>
                <LocationOnIcon style={{ color: "white" }} />
              </label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MsgInputSection;

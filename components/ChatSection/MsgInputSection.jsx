import React, { useState, useContext } from "react";
import { getuserId } from "../../routers/user";
import { AccountContext } from "../../context/AccountProvider";
import { setmessage } from "../../routers/message";
import { uploadFile } from "../../routers/file";
import styles from "../../styles/chat.module.css";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";

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
  const [inputholder, setinputholder] = useState("");

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
    setinputholder(input);
    e.preventDefault();
    const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
    setAccount(localStoragedata);
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

        await setmessage(msg);
        socket.current.emit("sendMessage", msg);
        setinput("");
        setimage("");
        setuplodedmsg(!uplodedmsg);
        setfile("");
      }
      setinput(" ");
      setinputholder("");
    }
  };

  const onfilechange = (e) => {
    console.log(e.target.files[0]);
    setfile(e.target.files[0]);
    console.log("first file ", file);
    setinput(e.target.files[0].name);
  };
  return (
    <>
      <div>
        <div className={`${styles.chatinputbox}`}>
          <div>
            <form action="#" onSubmit={(e) => sendmsg(e)}>
              <input
                onChange={(e) => {
                  setinput(e.target.value);
                }}
                value={input}
                type="search"
                id="first_name"
                placeholder="Send Message..."
                required
              />
            </form>
          </div>

          <div>
            <div className={`${styles.sendbtn}`} onClick={sendmsg}>
              <SendRoundedIcon style={{ color: "white" }} />
            </div>
          </div>
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
        </div>
      </div>
    </>
  );
};

export default MsgInputSection;

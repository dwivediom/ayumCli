import axios from "axios";
const host = process.env.NEXT_PUBLIC_B_PORT_CHAT;

export const uploadFile = async (data) => {
  try {
    let url = `${host}/file/upload`;
    console.log("filedata ", filedata);
    const filedata = await axios.post(url, data);
    return filedata;
  } catch (err) {
    console.log("error in while uploading the  file ", err.message);
  }
};

export const getfile = async (filelink) => {
  try {
    let url = `${host}/file/get/${filelink}`;
    const file = await axios.get(url);
    return file;
  } catch (err) {
    console.log("error on getting file ", err.message);
  }
};

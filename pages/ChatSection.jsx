import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "../styles/newchat.module.css";
import styles1 from "../styles/booktest.module.css";
import RCcontainer from "../components/usersSection/RCcontainer";
import ChatBox from "../components/ChatSection/ChatBox";
import { AccountContext } from "../context/AccountProvider";
import { useRouter } from "next/router";
import { uploadFile } from "../routes/file";
import { validateAndCompressImage, isImageFile, createProgressCallback } from "../utils/imageCompression";
import { setmessage } from "../routes/message";
import { getuserId } from "../routes/user";
import { searchApi } from "../routes/search";
import Image from "next/image";
import Search from "../components/usersSection/Search";
import English from "../public/locales/en/labtest";
import Hindi from "../public/locales/hi/labtest";

const ChatSection = () => {
  const [searchimg, setsearchimg] = useState(false);
  const {
    person,
    msgopened,
    account,
    setAccount,
    setmsgchange,
    socket,
    setuplodedmsg,
    uplodedmsg,
    setscrollbox,
    lang,
  } = useContext(AccountContext);
  useEffect(() => {
    const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
    setAccount(localStoragedata);
  }, []);
  const router = useRouter();

  const [tab, settab] = useState(0);
  const [inputactive, setinputactive] = useState(0);

  const [submitted, setsubmitted] = useState(false);
  const [searchactive, setsearchactive] = useState(false);

  const [inputdata, setinputdata] = useState({
    name: "",
    phone: "",
    city: "",
  });
  // useEffect(() => {
  //   const users = async () => {
  //     const localStoragejwt = localStorage.getItem("userjwt");
  //     let data = await getuser();

  //     const localStoragedata = JSON.parse(localStorage.getItem("labuser"));
  //     setadmin(localStoragedata);
  //     console.log(admin && admin);
  //     setalluser(data);
  //   };
  //   users();
  // }, []);

  const [mobile, setmobile] = useState(false);
  useEffect(() => {
    if (!localStorage.usertoken || !localStorage.labuser) {
      router.push("/User/UserRegistrationPage");
    }
    console.log(screen.width, "screen width hai");
    console.log(window.innerWidth, "windows width hai");
    if (window.innerWidth < 650) {
      setmobile(true);
    }

    return;
  }, []);

  const handleChange = useCallback((e) => {
    setfields(false);
    e.preventDefault();
    setinputdata({ ...inputdata, [e.target.name]: e.target.value });
  });

  async function sendtextmsg() {
    console.log(inputdata);
    let data = await getuserId(account.sub, "115971436675659419788");
    let msg = {};
    msg = {
      conversationId: data.data._id,
      senderId: account.sub,
      reciverId: "115971436675659419788",
      text: `Name : ${inputdata.name} ,  Phone : ${inputdata.phone} , city: ${inputdata.city}`,
      type: "text",
    };
    await setmessage(msg);
  }

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
        return filedata.data;
      } finally {
        setUploading(false);
        setCompressing(false);
        setUploadProgress("");
        setCompressionProgress(0);
      }
    }
  };

  async function sendfilemsg() {
    const newfile = await getconst();
    let data = await getuserId(account.sub, "115971436675659419788");
    let msg = {};
    msg = {
      conversationId: data.data._id,
      senderId: account.sub,
      reciverId: "115971436675659419788",
      text: newfile,
      type: "file",
    };
    setmsgchange(msg);
    await setmessage(msg);
    socket.current.emit("sendMessage", msg);

    setuplodedmsg(!uplodedmsg);
    setfile(null);
  }
  const [loading, setloading] = useState(false);
  const [fields, setfields] = useState(false);
  const handleSubmit = async () => {
    if (inputdata.name == "" || inputdata.phone == "") {
      setfields(true);
      return;
    }
    setloading(true);
    await sendtextmsg();
    if (file) {
      await sendfilemsg();
    }
    setloading(false);
    setsubmitted(true);
    handleStart();
    setinputdata({
      name: "",
      phone: "",
      city: "",
    });
    setfile(null);
  };

  const [file, setfile] = useState();
  const [uploaded, setuploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [compressionProgress, setCompressionProgress] = useState(0);
  
  const onfilechange = (e) => {
    e.preventDefault();
    setfile(e.target.files[0]);
    setuploaded(true);
    console.log(file && file, "File");
  };

  const [time, setTime] = useState(180); // 3 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning && time > 0) {
      timer = setTimeout(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (time === 0) {
      clearTimeout(timer);
      setIsRunning(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isRunning, time]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(180); // Reset timer to 3 minutes
  };
  const [input, setinput] = useState("");
  const handleSearchChange = (e) => {
    e.preventDefault();
    if (input == "" || !input || input == " ") {
      setsearchdata(null);
    }
    setinput(e.target.value);
  };
  const [searcheddata, setsearchdata] = useState();
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(input);
    if (input != "") {
      const data = await searchApi(input);
      console.log("data", data);
      setsearchdata(data.data);
    }
  };

  // const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    // setscrollbox(false);
    let indexbox = document.getElementById("chatpage");
    console.log(indexbox.scrollTop);
    indexbox.addEventListener("scroll", () => {
      let scrollTop = indexbox.scrollTop;
      if (scrollTop > 0) {
        setscrollbox(false);
      } else {
        setscrollbox(true);
      }
    });
  }, []);

  console.log(lang, "language h");

  return (
    <>
      <div className={`${styles.chatpage}`} id="chatpage">
        <div
          style={
            {
              // marginTop: "-1rem",
            }
          }
          className={`${styles.chatnav}`}
        >
          <div
            style={{ borderBottom: tab == 0 && "4px solid rgb(1, 207, 207)" }}
            onClick={() => settab(0)}
          >
            General
          </div>
          <div
            style={{ borderBottom: tab == 1 && "4px solid rgb(1, 207, 207)" }}
            onClick={() => settab(1)}
          >
            Chats
          </div>
        </div>
        {tab == 0 && (
          <div id="component1" className={styles1.reportcontainer}>
            <div className={`${styles1.reportshell} shadow-xl`}>
              {submitted ? (
                <div>
                  {time === 0 ? (
                    <p className="text-center font-bold mt-3 mb-[5rem] leading-loose">
                      {lang == "en" ? English.hopecall : Hindi.hopecall}
                      <br />{" "}
                      <span className="text-red-600">
                        {" "}
                        {lang == "en" ? English.ifnot : Hindi.ifnot}
                      </span>{" "}
                      <br /> {lang == "en" ? English.bookcall : Hindi.bookcall}{" "}
                      <br />
                      <span className="text-xl ">9425681022</span>
                    </p>
                  ) : (
                    <div>
                      <h1 className="text-center text-lg font-bold  text-green-900">
                        {lang == "en"
                          ? English.thankforrequest
                          : Hindi.thankforrequest}{" "}
                      </h1>
                      <h2 className="text-center font-bold mt-3">
                        {lang == "en"
                          ? English.weareconnecting
                          : Hindi.weareconnecting}
                      </h2>

                      <p className="text-center mt-8 mb-8 text-[2rem] font-bold text-green-800">
                        {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}
                        {time % 60} min
                      </p>
                    </div>
                  )}
                  {/* <button onClick={() => handleStart()}>Start</button> */}
                </div>
              ) : (
                <div className={`${styles1.reportform} `}>
                  <div
                    style={{
                      display: "block",
                    }}
                  >
                    <h1>
                      {lang == "en" ? English.bookfromhome : Hindi.bookfromhome}
                    </h1>
                    <p className="text-sm ml-1">
                      {lang == "en" ? English.book30off : Hindi.book30off}
                    </p>
                  </div>

                  <div>
                    <img
                      style={{
                        display:
                          (inputactive == 1 || inputdata.name != "") && "none",
                      }}
                      width="64"
                      height="64"
                      src="https://img.icons8.com/pastel-glyph/64/008890/name.png"
                      alt="name"
                    />
                    <input
                      type="text"
                      onChange={(e) => handleChange(e)}
                      value={inputdata.name}
                      name="name"
                      className="shadow-md "
                      onFocus={() => setinputactive(1)}
                      onBlur={() => setinputactive(0)}
                      placeholder={
                        inputactive == 1
                          ? lang == "en"
                            ? English.entername
                            : Hindi.entername
                          : lang == "en"
                          ? `        ${English.entername}`
                          : `        ${Hindi.entername}`
                      }
                    />
                  </div>
                  <div>
                    <img
                      style={{
                        display:
                          (inputactive == 2 || inputdata.phone != "") && "none",
                      }}
                      width="50"
                      height="50"
                      src="https://img.icons8.com/ios/50/008890/apple-phone.png"
                      alt="apple-phone"
                    />
                    <input
                      type="number"
                      className="shadow-md"
                      name="phone"
                      value={inputdata.phone}
                      onChange={(e) => handleChange(e)}
                      onFocus={() => setinputactive(2)}
                      onBlur={() => setinputactive(0)}
                      placeholder={
                        inputactive == 2
                          ? lang == "en"
                            ? English.enterphone
                            : Hindi.enterphone
                          : lang == "en"
                          ? `        ${English.enterphone}`
                          : `        ${Hindi.enterphone}`
                      }
                    />
                  </div>
                  <div>
                    <img
                      style={{
                        display:
                          (inputactive == 3 || inputdata.city != "") && "none",
                      }}
                      width="50"
                      height="50"
                      src="https://img.icons8.com/ios-filled/100/008890/environmental-planning.png"
                      alt="environmental-planning"
                    />
                    <input
                      type="text"
                      className="shadow-md"
                      name="city"
                      value={inputdata.city}
                      onChange={(e) => handleChange(e)}
                      onFocus={() => setinputactive(3)}
                      onBlur={() => setinputactive(0)}
                      placeholder={
                        inputactive == 3
                          ? lang == "en"
                            ? English.entercity
                            : Hindi.entercity
                          : lang == "en"
                          ? `        ${English.entercity}`
                          : `        ${Hindi.entercity}`
                      }
                    />
                  </div>
                  <div>
                    {uploaded ? (
                      <div className="w-full p-2 bg-white rounded-xl  text-green-900 font-bold shadow-md">
                        <img
                          width="64"
                          style={{
                            marginLeft: "5rem",
                          }}
                          height="64"
                          src="https://img.icons8.com/external-creatype-glyph-colourcreatype/64/009653/external-check-essential-ui-v1-creatype-glyph-colourcreatype.png"
                          alt="external-check-essential-ui-v1-creatype-glyph-colourcreatype"
                        />{" "}
                        <span>
                          {" "}
                          {lang == "en"
                            ? English.uploaded
                            : Hindi.uploaded}{" "}
                        </span>
                      </div>
                    ) : (
                      <>
                        {" "}
                        <label
                          htmlFor="prescription"
                          className="w-full cursor-pointer text-center p-2 bg-white rounded-xl text-green-900 font-bold shadow-md"
                        >
                          <img
                            width="66"
                            height="66"
                            src="https://img.icons8.com/metro/52/008890/upload-to-cloud.png"
                            alt="external-Upload-networking-smashingstocks-glyph-smashing-stocks"
                          />{" "}
                          <span className="ml-[2.5rem]">
                            {lang == "en" ? English.uploadpre : Hindi.uploadpre}
                          </span>
                          <span className="text-sm text-gray-500">
                            {" "}
                            ( {lang == "en" ? English.optional : Hindi.optional}
                            )
                          </span>
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            onfilechange(e);
                          }}
                          className="hidden"
                          id="prescription"
                          name="prescription"
                        />
                        {uploading && (
                          <div style={{
                            marginTop: "8px",
                            padding: "6px 12px",
                            background: "#e3f2fd",
                            borderRadius: "6px",
                            border: "1px solid #2196f3",
                            fontSize: "12px",
                            color: "#1976d2",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: "12px" }}></i>
                            <span>{uploadProgress}</span>
                          </div>
                        )}
                        {" "}
                      </>
                    )}
                  </div>
                </div>
              )}
              {!submitted ? (
                loading ? (
                  <div className="h-[2.5rem] w-full">
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                      }}
                      src="/loader4.svg"
                      alt="loading"
                    />
                  </div>
                ) : fields ? (
                  <p className="text-center text-red-500 font-bold">
                    {lang == "en" ? English.fillnecessary : Hindi.fillnecessary}
                  </p>
                ) : (
                  <button
                    className={`${styles1.submitbtn} shadow-md`}
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={uploading}
                    style={{
                      opacity: uploading ? 0.7 : 1,
                      cursor: uploading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {uploading ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: "14px" }}></i>
                        <span>{uploadProgress || (lang == "en" ? "Processing..." : "प्रोसेसिंग...")}</span>
                      </div>
                    ) : (
                      lang == "en" ? English.submit : Hindi.submit
                    )}
                  </button>
                )
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center ",
                      position: "relative",
                    }}
                    className="w-full "
                  >
                    <button className={`${styles1.exitbtn} shadow-lg`}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center ",
                          position: "relative",
                        }}
                        className="w-full h-full "
                      >
                        <img
                          width="64"
                          height="64"
                          src="https://img.icons8.com/glyph-neue/64/008890/ok--v1.png"
                          alt="external-check-essential-ui-v1-creatype-glyph-colourcreatype"
                        />
                      </div>
                    </button>
                    <div className={`${styles1.exittxt} shadow-lg`}>
                      {lang == "en" ? English.reqsent : Hindi.reqsent}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {tab == 1 && (
          <div
            id="component2"
            style={{
              position: msgopened && mobile && "fixed",
              top: msgopened && mobile && "4rem",
              padding: msgopened && mobile && "0",
            }}
            className={styles.chatcontainer}
          >
            <div
              style={{
                display: msgopened && mobile && "none",
              }}
              className={styles.chatdiv1}
            >
              <div className={styles.chatdiv1head}>
                <img
                  width="64"
                  height="64"
                  src="https://img.icons8.com/external-glyph-geotatah/64/006666/external-health-workmen-compensation-glyph-glyph-geotatah.png"
                  alt="external-health-workmen-compensation-glyph-glyph-geotatah"
                />
                <h1> {lang == "en" ? English.labtests : Hindi.labtests}</h1>
              </div>
              <div className={styles.chatdiv1search}>
                <form action="#" onSubmit={(e) => handleSearch(e)}>
                  <img
                    style={{
                      display: searchimg && "none",
                    }}
                    width="48"
                    height="48"
                    src="https://img.icons8.com/fluency-systems-regular/48/4D4D4D/search--v1.png"
                    alt="search--v1"
                  />

                  <input
                    onFocus={() => {
                      setsearchactive(true);
                      setsearchimg(true);
                    }}
                    // onBlur={() => {
                    //   setsearchactive(false);
                    //   setinput("");
                    //   setsearchimg(false);
                    // }}
                    onChange={(e) => handleSearchChange(e)}
                    type="text"
                    value={input}
                    placeholder={
                      searchimg
                        ? lang == "en"
                          ? English.searchemail
                          : Hindi.searchemail
                        : lang == "en"
                        ? `        ${English.searchandsendrep}`
                        : `        ${Hindi.searchandsendrep}`
                    }
                  />
                </form>
              </div>
              {searchactive ? (
                <div>
                  {searcheddata && searcheddata.length > 0 ? (
                    <div>
                      <div
                        onClick={() => {
                          setsearchactive(false);
                          setinput("");
                          setsearchimg(false);
                        }}
                        className="w-full shadow p-1 pl-3  flex items-center gap-2"
                      >
                        <Image
                          src={"/close.svg"}
                          width={25}
                          height={25}
                          alt="close"
                        />{" "}
                      </div>

                      <Search searcheddata={searcheddata} admin={account} />
                    </div>
                  ) : (
                    <div className=" relative h-[60vh] w-full  flex-col  flex justify-left items-center pt-6">
                      <span className="font-bold text-green-800">
                        {" "}
                        {lang == "en" ? English.searchemail : Hindi.searchemail}
                      </span>{" "}
                      <Image
                        style={{
                          position: "absolute",
                        }}
                        className={styles.heartimg}
                        src={"/heart.svg"}
                        width={200}
                        height={80}
                        alt="search user mail id"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ minHeight: "60vh" }}>
                  <RCcontainer />
                </div>
              )}
            </div>
            <div
              // style={{
              //   display: msgopened && mobile && "block",
              //   width: "100%",
              // }}
              className={styles.chatdiv2}
            >
              {person && (
                <div
                  style={
                    mobile ? { display: !msgopened ? "none" : "block" } : {}
                  }
                >
                  <ChatBox />
                </div>
              )}
            </div>
            <div className={styles.chatdiv3}>
              <div className={`${styles.chatdiv3head} shadow-md`}></div>
              <div className="shadow-lg">
                <img
                  width="64"
                  height="64"
                  src="https://img.icons8.com/external-becris-solid-becris/64/006666/external-home-literary-genres-becris-solid-becris.png"
                  alt="external-home-literary-genres-becris-solid-becris"
                />
                <p>
                  {lang == "en" ? English.reportdelivery : Hindi.reportdelivery}
                </p>
              </div>
              <div className="shadow-lg">
                <img
                  width="50"
                  height="50"
                  src="https://img.icons8.com/ios-filled/50/006666/android.png"
                  alt="android"
                />
                <p>
                  {lang == "en" ? English.onlinedeliver : Hindi.onlinedeliver}
                </p>
              </div>
              <div className="shadow-lg">
                <img
                  width="64"
                  height="64"
                  src="https://img.icons8.com/pastel-glyph/64/006666/sale--v2.png"
                  alt="sale--v2"
                />
                <p>{lang == "en" ? English.book30off : Hindi.book30off}</p>
              </div>
              <div className="shadow-lg">
                <img
                  width="50"
                  height="50"
                  src="https://img.icons8.com/ios/50/006666/running--v1.png"
                  alt="running--v1"
                />
                <p>{lang == "en" ? English.servicefast : Hindi.servicefast}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatSection;

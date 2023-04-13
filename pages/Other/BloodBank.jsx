import Image from "next/image";
import React, { useEffect, useState } from "react";
import DirectoryCard from "../../components/DirectoryCard";
import { SearchDoc } from "../../routes/directory";
import styles from "../../styles/BloodPage.module.css";

const BloodBank = () => {
  const [data, setdata] = useState();
  const [loading, setloading] = useState(false);
  useEffect(() => {
    async function searchblood() {
      setloading(true);
      const key = "Blood Bank";
      const data = await SearchDoc(key);
      setdata(data && data.data);
      setloading(false);
    }
    searchblood();
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className={styles.bloodheadback}></div>
        <div className={styles.followdiv}>
          <a
            rel="noreferrer"
            href="https://www.instagram.com/ayum_health/"
            target={"_blank"}
          >
            <h3>Follow For More Updates and Healthy Announcements</h3>{" "}
            <div>
              <Image
                width={50}
                height={50}
                alt="instagram"
                src="https://img.icons8.com/3d-fluency/94/null/instagram-new.png"
              />
              <a
                rel="noreferrer"
                href="https://www.instagram.com/ayum_health/"
                target={"_blank"}
              >
                <span>@Ayum_health</span>
              </a>
            </div>
          </a>
        </div>
        <h1
          style={{
            fontSize: "1.3rem",
            boxShadow: "2px 2px 15px rgba(0,0,0,0.3)",
          }}
          className=" text-center mb-8 font-bold text-white bg-red-600 p-4 rounded-md"
        >
          Blood Banks Related Information
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: "2rem",

            height: "16rem",
            overflow: "auto",
            flexWrap: "wrap",
          }}
        >
          {loading ? (
            <div
              style={{
                width: "100vw",
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={"/loader.svg"}
                width={20}
                height={20}
                alt="Loading..."
              />
            </div>
          ) : (
            data &&
            data.map((item) => {
              return <DirectoryCard key={item._id} item={item && item} />;
            })
          )}
        </div>

        <div className={styles.announcediv}>
          <h2 className={styles.announcehead}>
            <img
              src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/null/external-loud-speaker-devices-icongeek26-flat-icongeek26.png"
              alt="announcement"
            />{" "}
            Announcement{" "}
            <img
              src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/null/external-loud-speaker-devices-icongeek26-flat-icongeek26.png"
              alt="announcement"
            />
          </h2>
          <div className={styles.announcedetail}>
            <div className={styles.announceimg}>
              <Image
                src={
                  "https://i.ibb.co/phWBrt8/Rewa-Mega-blood-Donation-camp.jpg"
                }
                alt="Mega Blood Donation Campaign"
                width={250}
                height={250}
              />
            </div>

            <p>
              <span>
                Join us in the upcoming mega blood donation camp in Rewa, and be
                a part of a life-saving mission. Your one act of kindness can
                make a huge difference in someone's life. Donating blood not
                only benefits the receiver but also has numerous health benefits
                for the donor. So, let's come forward and be a hero in someone's
                story by donating blood. Your generosity can inspire others to
                do the same and create a chain of love and hope.
              </span>
              <br /> <br />
              <span>
                जीवन के अहम पहलू रक्तदान का महत्व अपनाकर हम सब दूसरों की मदद कर
                सकते हैं। आओ, इस नोबल कार्य में शामिल हों और सामूहिक रूप से
                जीवनों को बचाने का ये संघर्ष करें।
              </span>
            </p>
          </div>
        </div>

        <div className={styles.mythbox}>
          <h3 className={styles.mythhead}>
            <img
              src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-blood-donation-anatomy-flaticons-flat-flat-icons.png"
              alt="blood donation"
            />
            Myths Related to Blood Donation <br /> रक्तदान से जुड़े हुए मिथक
            <img
              src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-blood-donation-anatomy-flaticons-flat-flat-icons.png"
              alt="blood donation"
            />
          </h3>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-orange-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान से शरीर कमजोर हो जाता है - यह गलत है। रिपोर्ट्स के अनुसार
              रक्तदान करने के बाद शरीर में नया रक्त उत्पन्न होता है, जो शरीर की
              ऊर्जा और ताकत को बढ़ाता है।
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-green-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान करने से वजन कम होता है - यह गलत है। रक्तदान करने से वजन कम
              नहीं होता है बल्कि आपके ब्लड को शुद्ध करके शरीर को चमकदार बनता है
              एवं स्किन की समस्याओ में भी सहायक है
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-violet-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान करने से खून की कमी होती है - यह गलत है। रक्तदान करने से
              शरीर के रक्त की कमी नहीं होती है। रक्तदान करने के बाद शरीर रक्त
              बनाना जारी रखता है और इससे शरीर के रक्त की मात्रा बनी रहती है।
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-yellow-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              आपको रक्तदान करने के लिए एक निश्चित वजन होना आवश्यक है - रक्तदान
              के लिए निश्चित वजन की आवश्यकता नहीं होती है। आपके शारीर के
              स्वास्थ्य पर निर्भर करता है कि आप रक्तदान कर सकते हैं या नहीं।
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-cyan-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान से आप संक्रमण हो सकता है - रक्तदान पूर्ण रूप से एक
              सुरक्षित प्रक्रिया है और रक्तदान से संक्रमण का कोई खतरा नहीं होता
              है।
            </span>
          </div>
        </div>
        <div className={styles.mythbox}>
          <h3 className={styles.mythhead}>
            <img
              src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-blood-donation-anatomy-flaticons-flat-flat-icons.png"
              alt="blood donation"
            />
            Benefits of Blood Donation <br /> रक्तदान करने के लाभ
            <img
              src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-blood-donation-anatomy-flaticons-flat-flat-icons.png"
              alt="blood donation"
            />
          </h3>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-orange-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान करने से शरीर का तापमान नियंत्रित रहता है और शरीर स्वस्थ
              रहता है।
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-green-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान करने से कुछ अधिक फायदे होते हैं, जैसे कि शरीर में विषैले
              पदार्थों का निकास, रक्त में उच्च वायु दाब को कम करना और किडनी की
              सेवा करना।
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-violet-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान करने से हृदय स्वस्थ रहता है। यह शरीर में अधिक लिपिड नहीं
              जमा करता है जो हृदय रोगों का कारण बन सकते हैं।
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-yellow-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान करने से शरीर के खून में तत्वों की विविधता बनी रहती है, जो
              शरीर को रोगों से लड़ने की क्षमता देती है।
            </span>
          </div>
          <div
            style={{
              width: "90vw",
            }}
            className={`${styles.myths} bg-cyan-200 rounded flex p-4 h-full  items-center`}
          >
            <svg
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-400 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-bold text-black">
              {" "}
              रक्तदान करने से शरीर के अन्य अंगों को भी लाभ मिलता है। यह शरीर के
              ऑक्सीजन लेवल को बढ़ाता है जो शरीर को ताकत देता है।
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodBank;

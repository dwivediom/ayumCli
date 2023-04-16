import React from "react";
import styles from "../../styles/BloodPage.module.css";
import Image from "next/image";
import Footer from "../../components/Footer";

const Campaign = () => {
  return (
    <>
      <div className="absolute">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className={styles.followdiv}>
            <h3>Follow For Updates and Healthy Announcements</h3>
            <a
              rel="noreferrer"
              href="https://www.instagram.com/ayum_health/"
              target={"_blank"}
            >
              <Image
                src="https://img.icons8.com/3d-fluency/94/null/instagram-new.png"
                width={50}
                height={50}
                alt="instagram"
              />

              <span>@Ayum_health</span>
            </a>
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
              <a
                rel="noreferrer"
                href="https://www.instagram.com/ayum_health/"
                target={"_blank"}
                className={styles.announceimg}
              >
                <Image
                  src={
                    "https://i.ibb.co/phWBrt8/Rewa-Mega-blood-Donation-camp.jpg"
                  }
                  alt="Mega Blood Donation Campaign"
                  width={260}
                  height={260}
                />
              </a>

              <p>
                <span className="text-lg">
                  आइए हम सब मिलकर रीवा में होने वाले रक्तदान शिविर में भाग लें
                  और जीवन बचाने के एक महत्वपूर्ण कार्य में हमारा सहयोग दें। आपका
                  एक उदार कार्य किसी के जीवन में बड़ा अंतर ला सकता है। रक्तदान
                  सिर्फ प्राप्तकर्ता के लाभ के लिए ही नहीं बल्कि दाता के लिए भी
                  अनेक स्वास्थ्य लाभ हैं। तो आइए आगे बढ़ें और किसी के कहानी में
                  एक हीरो बनकर रक्तदान करें।
                </span>
                <br />
              </p>
            </div>
          </div>
          <div className={`${styles.announcediv} mt-6`}>
            <h2 className={styles.announcehead}>
              <img
                src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-support-mental-health-flaticons-flat-flat-icons.png"
                alt="flaticons"
              />
              Supporting Organizations
              <img
                style={{
                  transform: "none",
                }}
                src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-support-mental-health-flaticons-flat-flat-icons.png"
                alt="flaticons"
              />
            </h2>
            <div className={styles.supportsbox}>
              <div
                style={{
                  width: "20rem",
                  padding: "10px",
                }}
              >
                <Image
                  style={{
                    borderRadius: "4px",
                  }}
                  objectFit="cover"
                  objectPosition={`left 30%`}
                  src={"https://i.ibb.co/nbBwFky/dang.jpg"}
                  alt="Mega Blood Donation Campaign"
                  width={300}
                  height={200}
                />

                <p>Hotel Dang Palace</p>
                <p>Rewa</p>
              </div>
              <div
                style={{
                  width: "20rem",
                  padding: "20px 10px",
                }}
              >
                <Image
                  style={{
                    borderRadius: "4px",
                  }}
                  src={"/deafaultpro.jpg"}
                  alt="Mega Blood Donation Campaign"
                  objectFit="cover"
                  objectPosition={`center 30%`}
                  width={300}
                  height={200}
                />

                <p>Not Available</p>
                <p>N/A</p>
              </div>
              <div
                style={{
                  width: "20rem",
                  padding: "10px",
                }}
              >
                <Image
                  style={{
                    borderRadius: "4px",
                  }}
                  src={"/deafaultpro.jpg"}
                  alt="Mega Blood Donation Campaign"
                  objectFit="cover"
                  objectPosition={`center 30%`}
                  width={300}
                  height={200}
                />

                <p>Not Available</p>
                <p>N/A</p>
              </div>
            </div>
          </div>
          <div className={`${styles.announcediv} mt-6`}>
            <h2 className={styles.announcehead}>
              <img
                src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-support-mental-health-flaticons-flat-flat-icons.png"
                alt="flaticons"
              />
              Supporting Personalities
              <img
                style={{
                  transform: "none",
                }}
                src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/null/external-support-mental-health-flaticons-flat-flat-icons.png"
                alt="flaticons"
              />
            </h2>
            <div className={styles.supportsbox}>
              <div
                style={{
                  width: "15rem",
                  padding: "20px 10px",
                }}
              >
                <Image
                  style={{
                    borderRadius: "4px",
                  }}
                  objectFit="cover"
                  objectPosition={`left 30%`}
                  src={"https://i.ibb.co/8zPQx6s/dangpic.jpg"}
                  alt="Mega Blood Donation Campaign"
                  width={220}
                  height={200}
                />

                <p>Paramjeet Singh Dang</p>
                <p>Social Activist</p>
              </div>
              <div
                style={{
                  width: "15rem",
                  padding: "20px 10px",
                }}
              >
                <Image
                  style={{
                    borderRadius: "4px",
                  }}
                  src={"https://i.ibb.co/bm8HYRW/IMG-20230411-133600.jpg"}
                  alt="Mega Blood Donation Campaign"
                  objectFit="cover"
                  objectPosition={`center 50%`}
                  width={220}
                  height={200}
                />

                <p>Mrs. Pratibha Pal</p>
                <p>IAS , Collector Rewa</p>
              </div>
              <div
                style={{
                  width: "15rem",
                  padding: "20px 10px",
                }}
              >
                <Image
                  style={{
                    borderRadius: "4px",
                  }}
                  src={"https://i.ibb.co/ZB31q3k/nw.jpg"}
                  alt="Mega Blood Donation Campaign"
                  objectFit="cover"
                  objectPosition={`center 10%`}
                  width={220}
                  height={200}
                />

                <p>Mrs. Sanskriti Jain</p>
                <p>Nagar Nigam Commissioner , Rewa</p>
              </div>
              {/* <div>
                <Image
                  style={{
                    borderRadius: "4px",
                  }}
                  src={
                    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  alt="Mega Blood Donation Campaign"
                  objectFit="cover"
                  objectPosition={`center 30%`}
                  width={200}
                  height={200}
                />

                <p>Name 1</p>
                <p>Designation</p>
              </div> */}
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
                रक्तदान से शरीर कमजोर हो जाता है - यह गलत है। रिपोर्ट्स के
                अनुसार रक्तदान करने के बाद शरीर में नया रक्त उत्पन्न होता है, जो
                शरीर की ऊर्जा और ताकत को बढ़ाता है।
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
                रक्तदान करने से वजन कम होता है - यह गलत है। रक्तदान करने से वजन
                कम नहीं होता है बल्कि आपके ब्लड को शुद्ध करके शरीर को चमकदार
                बनता है एवं स्किन की समस्याओ में भी सहायक है
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
                सुरक्षित प्रक्रिया है और रक्तदान से संक्रमण का कोई खतरा नहीं
                होता है।
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
                रक्तदान करने से शरीर के खून में तत्वों की विविधता बनी रहती है,
                जो शरीर को रोगों से लड़ने की क्षमता देती है।
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
                रक्तदान करने से शरीर के अन्य अंगों को भी लाभ मिलता है। यह शरीर
                के ऑक्सीजन लेवल को बढ़ाता है जो शरीर को ताकत देता है।
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Campaign;

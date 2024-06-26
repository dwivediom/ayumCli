import React from "react";
import styles from "../styles/Home.module.css";
import { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import { useEffect } from "react";
const PrivacyPolicy = () => {
  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    let indexbox = document.getElementById("privacybox");
    // console.log(indexbox.scrollTop);
    indexbox.addEventListener("scroll", () => {
      let scrollTop = indexbox.scrollTop;
      if (scrollTop > 0) {
        setscrollbox(false);
      } else {
        setscrollbox(true);
      }
    });
  }, []);
  return (
    <div id="privacybox" className={` ${styles.privacybox} pb-20 absolute p-3`}>
      <div>
        <h1 className="font-bold mb-2 text-left">Privacy Policy</h1>
        <p className=" text-left">
          We take the privacy and security of your personal information
          seriously. Our app collects only the necessary information to
          facilitate appointments and communicate with doctors. We do not share
          or sell your information to any third-party. By using our app, you
          consent to the collection and use of your personal information as
          described in this policy.
        </p>
      </div>
      <div>
        <h1 className="font-bold mb-2 mt-8 text-left">Terms and Conditions</h1>
        <ol>
          <li className=" list-disc	ml-2 text-left mb-3">
            Users can use the app to book appointments with doctors. The
            availability of doctors is based on their own schedule and
            availability. Users are responsible for ensuring the accuracy of
            their personal information, including contact details and medical
            history. Users may cancel or reschedule their appointments, subject
            to the policies of the doctor they have booked with. Doctors may
            cancel or reschedule appointments at their discretion.
          </li>
          <li className=" list-disc ml-2  text-left mb-3">
            The app is not intended to provide medical advice, diagnosis, or
            treatment. Users are responsible for seeking appropriate medical
            advice from qualified healthcare professionals. Doctors are
            responsible for providing accurate and appropriate medical advice to
            their patients. The app is not liable for any medical advice
            provided by doctors using the app.
          </li>
          <li className=" list-disc ml-2 	 text-left mb-3">
            The app includes a chat app to allow users and doctors to
            communicate. Users and doctors are responsible for the accuracy and
            appropriateness of their communications. Users and doctors must
            comply with any relevant laws and regulations related to
            communications. The app reserves the right to monitor and moderate
            the chat app as necessary.
          </li>
          <li className=" list-disc ml-2 	 text-left mb-3">
            All intellectual property rights in the app belong to Ayum. Users
            may not reproduce, modify, distribute, or otherwise use any part of
            the app without the written permission of Ayum.
          </li>
          <li className=" list-disc ml-2 	 text-left mb-3">
            The app is provided as without any representations or warranties,
            express or implied. The app does not warrant the accuracy,
            completeness, or timeliness of the information provided by doctors
            or users. The app is not liable for any damages arising from the use
            of the app, including but not limited to loss of profits, business
            interruption, or data loss.
          </li>
          <li className=" list-disc	ml-2  text-left mb-3">
            The app reserves the right to modify these terms and conditions at
            any time. Users can see updated changes at any time from{" "}
            <a
              rel="noreferrer"
              className="text-blue-500"
              href="https://www.ayum.in"
              target={"_blank"}
            >
              Ayum.in
            </a>
            Terms and condition page .
          </li>
        </ol>

<h3> Data Deletion </h3>

<p> <b>User Request Process:</b>

Users can request deletion of their data by emailing our Data Privacy team at contact@ayum.in. In your email, please include your full name and any associated account information (username, email address, etc.) for easy identification.

Data Deletion Timeline:

We aim to respond to all data deletion requests within [30] business days. Once your request is verified, we will delete your data from our systems within an additional [30] business days.

Important Note:

Due to legal or regulatory requirements, we may be required to retain some limited data even after your account deletion. This data will be anonymized and used only for the specified legal or regulatory purpose.

Please note: You can adjust the bracketed values (e.g., [30] for business days) to reflect your specific data deletion timeframe.

This section outlines the user request process, data deletion timeline, and any relevant considerations for data retention. Remember to update the bracketed values with your preferred timeframe. You can also add a link to your privacy policy for further details if you have one.
     
</p>   
     
      </div>
    </div>
  );
};

export default PrivacyPolicy;

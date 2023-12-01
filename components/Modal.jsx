import Image from "next/image";
import React, { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import styles from "../styles/Home.module.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "21rem",
  // bgcolor:
  //   "linear-gradient(90deg, rgba(0,172,89,1) 0%, rgba(0,162,71,1) 35%, rgba(0,255,179,1) 100%)",
  borderRadius: "12px",
  color: "white",
  boxShadow: "none",
  outline: "none",
  boxShadow: "0 0 20px rgba(0, 255, 255, 0.236)",

  // background: "linear-gradient(to right,  rgba(255,255,255,1),  #cfcfcf)",
  background: "#fff",
  p: 4,
};
const ThankModal = () => {
  const { setthankmodal, thankmodal, lang } = useContext(AccountContext);
  return (
    <>
      {/* <div className={styles.modalback}>
        <div className={styles.modalbox}>
          <h1 className="text-center">Thankyou For Connecting With Ayum</h1>
          <img
            src="https://img.icons8.com/external-fauzidea-flat-fauzidea/64/null/external-success-online-learning-fauzidea-flat-fauzidea.png"
            alt="success"
          />
          <div
            onClick={() => {
              localStorage.setItem("thankmodal", false);
              setthankmodal(false);
            }}
            className={styles.closemodal}
          >
            Close
          </div>
        </div>
      </div> */}
      <Modal
        open={thankmodal}
        onClose={() => setthankmodal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ padding: "0" }}
      >
        <Box sx={style}>
          <Typography
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "teal",
              fontWeight: "bold",
              fontSize: "18px",
            }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {lang == "en" ? English.thankmsg : Hindi.thankmsg}
            <img
              style={{
                width: "45px",
                height: "45px",
              }}
              src="https://img.icons8.com/external-fauzidea-flat-fauzidea/64/null/external-success-online-learning-fauzidea-flat-fauzidea.png"
              alt="success"
            />
          </Typography>
          <Typography
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "black",
            }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            {lang == "en" ? English.twoclickmsg : Hindi.twoclickmsg}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ThankModal;

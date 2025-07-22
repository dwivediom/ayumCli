// components/WithAuth.js
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { isTokenExpired } from "../public/utils/Utils";
import { AccountContext } from "../context/AccountProvider";
import { FiAlertTriangle } from "react-icons/fi"; // Add this for a warning icon

const WithAuth1 = (WrappedComponent) => {
  return function ProtectedRoute(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("usertoken");

      if (!token || isTokenExpired(token)) {
        setShowDialog(true); // Show Dialog
        localStorage.removeItem("usertoken");
      } else {
        setIsAuthenticated(true);
      }
    }, []);

    const { openDrawer, setclosingdrawerallowed } = useContext(AccountContext);

    const handleLoginRedirect = () => {
      setShowDialog(false);
      //   router.push("/User/UserRegistrationPage");
      openDrawer();
      //   setclosingdrawerallowed(false);
    };

    if (!isAuthenticated) {
      return (
        <Dialog
          visible={showDialog}
          onHide={handleLoginRedirect}
          header={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiAlertTriangle color="#FFA726" size={24} />
              <span style={{ fontWeight: 600, fontSize: 18, color: "#333" }}>
                Session Expired
              </span>
            </div>
          }
          closable={false}
          draggable={false}
          style={{
            width: "90%",
            maxWidth: 380,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            background: "#fffbe7",
          }}
          maskStyle={{
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(2px)",
          }}
          footer={
            <Button
              style={{
                marginTop: 16,
                background: "rgb(18, 207, 210)",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 8,
                padding: "8px 24px",
                fontSize: 16,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
              }}
              label="Login"
              icon="pi pi-sign-in"
              onClick={handleLoginRedirect}
            />
          }
        >
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <p style={{ color: "#6d4c41", fontSize: 16, marginBottom: 0 }}>
              Your session has expired.
              <br />
              Please log in again to continue.
            </p>
          </div>
        </Dialog>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth1;

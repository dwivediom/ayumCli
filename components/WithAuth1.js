// components/WithAuth.js
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { isTokenExpired } from "../public/utils/Utils";
import { AccountContext } from "../context/AccountProvider";

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
          header="Session Expired"
          closable={false}
          draggable={false}
          footer={
            <Button
              style={{ marginTop: "10px" }}
              label="Login"
              onClick={handleLoginRedirect}
            />
          }
        >
          <p>Your session has expired. Please log in again.</p>
        </Dialog>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth1;

// pages/settings.js
import React, { useEffect, useRef, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [deletedialog, setdeletedialog] = useState(false);
  const [confirmtext, setconfirmtext] = useState("");
  const toast = useRef();
  const [deleteload, setdeleteload] = useState(false);
  const router = useRouter();
  const { query } = router;

  const DeleteAccount = async () => {
    setdeleteload(true);
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/user/deleteuser`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.usertoken,
          },
        }
      );
      if (!result.data.error) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Account Deleted Successfully!",
          life: 3000,
        });

        setdeleteload(false);
        setdeletedialog(false);
        let lang = localStorage.getItem("locale");
        let city = localStorage.getItem("city");
        localStorage.clear();
        localStorage.setItem("locale", lang);
        localStorage.setItem("city", city);
        router.push("/User/UserRegistrationPage");
        // router.push("/Member/memberLoginPage");
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.data.message
            ? result.data.message
            : "Something went wrong",
          life: 3000,
        });
        setdeleteload(false);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message ? error.message : "Something went wrong",
        life: 3000,
      });
      setdeleteload(false);
    }
  };
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Update the activeIndex based on the query parameter
    if (query.tab) {
      const tabIndex = parseInt(query.tab, 10);
      if (!isNaN(tabIndex)) {
        setActiveIndex(tabIndex);
      }
    }
  }, [query.tab]);

  const onTabChange = (e) => {
    setActiveIndex(e.index);
    // Update the router query when the tab changes
    router.push(
      {
        pathname: router.pathname,
        query: { ...query, tab: e.index },
      },
      undefined,
      { shallow: true } // Prevents full page reload
    );
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center" }}
      className="p-p-3 p-sm-4"
    >
      <Toast ref={toast} />
      <div
        style={{ padding: "1rem", width: "fit-content" }}
        className="p-card p-shadow-3 p-p-4 p-border-round"
      >
        <h2 className="p-text-center p-mb-4">Settings</h2>
        <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
          {/* Account Settings */}
          <TabPanel header="Account Settings">
            <div style={{ color: "purple", textAlign: "center" }}>
              Under Development!
            </div>
            {/* <div className="p-fluid p-grid p-formgrid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="username">Username</label>
                <InputText id="username" placeholder="Enter your username" />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="p-field p-col-12">
                <label htmlFor="password">Password</label>
                <Password id="password" toggleMask feedback={false} />
              </div>
              <div className="p-field p-col-12 p-text-right">
                <Button
                  label="Save Changes"
                  className="p-button-success p-mt-3"
                />
              </div>
            </div> */}
          </TabPanel>

          {/* Notifications */}
          <TabPanel header="Notifications">
            <div style={{ color: "purple", textAlign: "center" }}>
              Under Development!
            </div>
            {/* <div className="p-fluid">
              <div className="p-field-checkbox">
                <Checkbox
                  inputId="emailNotifications"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.checked)}
                />
                <label htmlFor="emailNotifications">Email Notifications</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox
                  inputId="smsNotifications"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.checked)}
                />
                <label htmlFor="smsNotifications">SMS Notifications</label>
              </div>
              <div className="p-text-right">
                <Button
                  label="Save Preferences"
                  className="p-button-primary p-mt-3"
                />
              </div>
            </div> */}
          </TabPanel>

          {/* Privacy */}
          <TabPanel header="Privacy">
            <div>
              <p>Control your privacy settings here.</p>
              <Divider />
              <Button
                label="Delete Account"
                icon="pi pi-trash"
                onClick={() => {
                  setdeletedialog(true);
                }}
                className="p-button-danger p-mt-3"
              />
            </div>
            <Dialog
              header="Confirm Deletion"
              visible={deletedialog}
              onHide={() => setdeletedialog(false)}
            >
              <h4 style={{ textAlign: "center", color: "red" }}>
                Are you sure you want to delete your account.
              </h4>
              {/* <p style={{ textAlign: "center", color: "black" }}>
                This will remove all your{" "}
                <b style={{ color: "red" }}>existing data</b> and{" "}
                <b style={{ color: "red" }}>subscriptions </b>
                on ayum
              </p> */}
              <div style={{ textAlign: "center", color: "red" }}>
                ! This action cannot be undone{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  gap: "10px",
                }}
              >
                <label>
                  Copy the text or write <b>confirmdelete</b> in below input to
                  delete account permanently.
                </label>
                <InputText
                  placeholder="Enter text from above"
                  onChange={(e) => {
                    setconfirmtext(e.target.value);
                  }}
                />
              </div>
              <div
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  onClick={() => {
                    setdeletedialog(false);
                  }}
                  outlined
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  loading={deleteload}
                  disabled={confirmtext !== "confirmdelete"}
                  onClick={() => {
                    // setdeletedialog(false);
                    DeleteAccount();
                  }}
                  className="p-button-danger p-mt-3"
                />
              </div>
            </Dialog>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}

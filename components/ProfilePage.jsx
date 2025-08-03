import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { AccountContext } from "../context/AccountProvider";
import axios from "axios";
import styles from "../styles/Profile.module.css";

const ProfilePage = () => {
  const router = useRouter();
  const { lang, setShowLoginPopup } = useContext(AccountContext);
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [counts, setCounts] = useState({
    appointments: 0,
    labRequests: 0,
    medicalRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharedView, setIsSharedView] = useState(false);
  const toast = useRef();

  // Check if this is a shared view
  useEffect(() => {
    const { share } = router.query;
    if (share) {
      setIsSharedView(true);
      // Load shared profile data
      loadSharedProfileData(share);
    } else {
      loadUserData();
    }
  }, [router.query]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("usertoken");

      if (!token) {
        // router.push("/User/UserRegistrationPage");
        setShowLoginPopup(true);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";
      
      // Load user profile data
      const userResponse = await axios.get(
        `${baseUrl}/api/user/getuser`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setUserData(userResponse.data);

      // Load user counts from the new API
      const countsResponse = await axios.get(
        `${baseUrl}/api/user/counts`,
        {
          headers: { "x-auth-token": token },
        }
      );
      
      if (countsResponse.data && !countsResponse.data.error) {
        setCounts(countsResponse.data.data);
      }

      // Load appointments
      const appointmentsResponse = await axios.get(
        `${baseUrl}/api/appointment/userappos`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setAppointments(appointmentsResponse.data?.data || []);

      // Load orders
      const ordersResponse = await axios.get(
        `${baseUrl}/api/medical/requests`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setOrders(ordersResponse.data?.data || []);

      // Load lab tests
      const labTestsResponse = await axios.get(
        `${baseUrl}/api/lab/bookings`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setLabTests(labTestsResponse.data?.data || []);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load profile data",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSharedProfileData = async (shareId) => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";
      // Load shared profile data (you'll need to implement this API)
      const response = await axios.get(
        `${baseUrl}/api/user/shared-profile/${shareId}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error loading shared profile:", error);
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load shared profile",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateShareLink = async () => {
    try {
      const token = localStorage.getItem("usertoken");
      const baseUrl = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";
      const response = await axios.post(
        `${baseUrl}/api/user/generate-share-link`,
        {},
        {
          headers: { "x-auth-token": token },
        }
      );

      const shareUrl = `${window.location.origin}/profile?share=${response.data.shareId}`;
      setShareUrl(shareUrl);
      setShowShareDialog(true);
    } catch (error) {
      console.error("Error generating share link:", error);
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate share link",
        life: 3000,
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast?.current?.show({
        severity: "success",
        summary: "Copied!",
        detail: "Share link copied to clipboard",
        life: 2000,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleActionButtonClick = (action) => {
    switch (action) {
      case "orders":
        router.push("/medical/requests");
        break;
      case "appointments":
        router.push("/User/userAppo");
        break;
      case "labTests":
        router.push("/lab/bookings");
        break;
      case "health":
        router.push("/profile?tab=health");
        break;
      default:
        break;
    }
  };

  const getActionButtonIcon = (action) => {
    switch (action) {
      case "orders":
        return "pi pi-shopping-bag";
      case "appointments":
        return "pi pi-calendar";
      case "labTests":
        return "pi pi-heartbeat";
      case "health":
        return "pi pi-user";
      default:
        return "pi pi-circle";
    }
  };

  const getActionButtonColor = (action) => {
    switch (action) {
      case "orders":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      case "appointments":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      case "labTests":
        return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
      case "health":
        return "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #00b9af",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Loading profile...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.errorContainer}>
        <h1>Profile Not Found</h1>
        <p>Unable to load profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toast ref={toast} />

      {/* Profile Header Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImage}>
            <Image
              src={userData.picture || "/deafaultpro.jpg"}
              alt={userData.name || "Profile"}
              width={150}
              height={150}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>

          <div className={styles.profileInfo}>
            <h1>{userData.name || "User"}</h1>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#666",
                }}
              >
                <i className="pi pi-user" style={{ color: "#4CAF50" }}></i>
                {userData.age ? `${userData.age} years` : "Age not set"}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#666",
                }}
              >
                <i
                  className="pi pi-venus-mars"
                  style={{ color: "#4CAF50" }}
                ></i>
                {userData.gender
                  ? userData.gender.charAt(0).toUpperCase() +
                    userData.gender.slice(1)
                  : "Not specified"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#666",
                fontSize: "0.875rem",
              }}
            >
              <i
                className="pi pi-calendar-plus"
                style={{ color: "#4CAF50" }}
              ></i>
              Joined{" "}
              {new Date(userData.date || Date.now()).toLocaleDateString()}
            </div>
          </div>

          {!isSharedView && (
            <div
              style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}
            >
              {/* <Button
                icon="pi pi-share-alt"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  border: "none",
                  color: "#64748b",
                }}
                onClick={generateShareLink}
                tooltip="Share Profile"
              /> */}
              {/* <Button
                icon="pi pi-pencil"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  border: "none",
                  color: "#64748b",
                }}
                onClick={() => {
                  if (!userData) {
                    setShowLoginPopup(true);
                    return;
                  }
                }}
                tooltip="Edit Profile"
              /> */}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Section - Only show if not shared view */}
      {!isSharedView && (
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { key: "orders", label: "Orders", count: counts.medicalRequests },
              {
                key: "appointments",
                label: "Appointments",
                count: counts.appointments,
              },
              { key: "labTests", label: "Lab Tests", count: counts.labRequests },
              { key: "health", label: "My Health", count: 0 },
            ].map((action) => (
              <div
                key={action.key}
                style={{
                  background: getActionButtonColor(action.key),
                  borderRadius: "16px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => handleActionButtonClick(action.key)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className={getActionButtonIcon(action.key)}
                    style={{ fontSize: "1.5rem", color: "white" }}
                  ></i>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {action.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      fontWeight: "500",
                    }}
                  >
                    {action.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Data Section */}
      <div className={styles.profileSection}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Profile Information
          </h2>
          {!isSharedView && (
            <Button
              icon="pi pi-pencil"
              style={{
                background: "#f1f5f9",
                border: "none",
                color: "#64748b",
                borderRadius: "8px",
              }}
              onClick={() => router.push("/User/UserRegistrationPage")}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <i className="pi pi-envelope" style={{ color: "#4CAF50" }}></i>
              Email
            </div>
            <div
              style={{ fontSize: "1rem", fontWeight: "500", color: "#1e293b" }}
            >
              {userData.email || "Not provided"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <i className="pi pi-phone" style={{ color: "#4CAF50" }}></i>
              Phone
            </div>
            <div
              style={{ fontSize: "1rem", fontWeight: "500", color: "#1e293b" }}
            >
              {userData.phone || "Not provided"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <i className="pi pi-map-marker" style={{ color: "#4CAF50" }}></i>
              Location
            </div>
            <div
              style={{ fontSize: "1rem", fontWeight: "500", color: "#1e293b" }}
            >
              {userData.city || userData.location || "Not provided"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <i className="pi pi-calendar" style={{ color: "#4CAF50" }}></i>
              Member Since
            </div>
            <div
              style={{ fontSize: "1rem", fontWeight: "500", color: "#1e293b" }}
            >
              {new Date(userData.date || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className={styles.profileSection}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 1.5rem 0",
          }}
        >
          Your Activity
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="pi pi-shopping-bag"
                style={{ fontSize: "1.25rem", color: "white" }}
              ></i>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                {counts.medicalRequests}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                Total Orders
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="pi pi-calendar"
                style={{ fontSize: "1.25rem", color: "white" }}
              ></i>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                {counts.appointments}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                Appointments
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="pi pi-heartbeat"
                style={{ fontSize: "1.25rem", color: "white" }}
              ></i>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                {counts.labRequests}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                Lab Tests
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="pi pi-star"
                style={{ fontSize: "1.25rem", color: "white" }}
              ></i>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                {userData.rating || 0}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog
        visible={showShareDialog}
        onHide={() => setShowShareDialog(false)}
        header="Share Profile"
        style={{ borderRadius: "16px" }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>
            Share your profile with others:
          </p>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <InputText
              value={shareUrl}
              readOnly
              style={{
                flex: 1,
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                padding: "0.75rem",
                fontSize: "0.875rem",
              }}
            />
            <Button
              icon="pi pi-copy"
              style={{
                background: "#f1f5f9",
                border: "none",
                color: "#64748b",
                borderRadius: "8px",
              }}
              onClick={copyToClipboard}
            />
          </div>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <Button
              label="Copy Link"
              icon="pi pi-copy"
              style={{
                background: "#00b9af",
                border: "none",
                color: "white",
                borderRadius: "8px",
              }}
              onClick={copyToClipboard}
            />
            <Button
              label="Close"
              icon="pi pi-times"
              style={{
                background: "#f1f5f9",
                border: "none",
                color: "#64748b",
                borderRadius: "8px",
              }}
              onClick={() => setShowShareDialog(false)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

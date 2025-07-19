import React, { useState } from "react";
import { useRouter } from "next/router";
import { InputText } from "primereact/inputtext";
import { FaSearch, FaMapMarkerAlt, FaBell, FaUser } from "react-icons/fa";

const NewHomePage2 = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <nav
        style={{
          position: "fixed",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
          top: "0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          left: "0",
          right: "0",
          zIndex: "100",
          padding: "16px 24px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Top Section - Logo and Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img
              alt="Ayum Logo"
              style={{
                width: "140px",
                height: "140px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                position: "absolute",
                top: "-30px",
                left: "0",
              }}
              onClick={() => router.push("/")}
              src="/ayumlogormbg.png"
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div style={{ width: "40px", height: "40px" }}></div>
          </div>

          {/* Right Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Location */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#f8f9fa",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "1px solid #e9ecef",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e9ecef";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
            >
              <FaMapMarkerAlt style={{ color: "#007bff", fontSize: "14px" }} />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                }}
              >
                Bangalore
              </span>
            </div>

            {/* Notifications */}
            <div
              style={{
                position: "relative",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "1px solid #e9ecef",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e9ecef";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
            >
              <FaBell style={{ color: "#6c757d", fontSize: "16px" }} />
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#dc3545",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Profile */}
            <div
              style={{
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0056b3";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#007bff";
              }}
            >
              <FaUser style={{ color: "white", fontSize: "16px" }} />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "16px",
              zIndex: "1",
            }}
          >
            <FaSearch style={{ color: "#6c757d", fontSize: "16px" }} />
          </div>
          <InputText
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for Lab Tests, Medicines, Doctors..."
            style={{
              width: "100%",
              padding: "16px 16px 16px 48px",
              borderRadius: "12px",
              border: "2px solid #e9ecef",
              fontSize: "16px",
              backgroundColor: "#f8f9fa",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#007bff";
              e.target.style.backgroundColor = "white";
              e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e9ecef";
              e.target.style.backgroundColor = "#f8f9fa";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </nav>
    </div>
  );
};

export default NewHomePage2;

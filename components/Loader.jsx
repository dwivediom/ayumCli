import React from "react";
import NewNavbar from "./NewNavbar";
import BottomNav from "./BottomNav"; // <-- Import your BottomNav

const Loader = () => {
  return (
    <div
      style={{ minHeight: "100vh", background: "#fff", position: "relative" }}
    >
      {/* Navbar always at the top */}
      <NewNavbar />

      {/* Centered spinner */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px - 56px)", // Subtract Navbar and BottomNav height
        }}
      >
        <div className="loader-spinner" />
        <span
          style={{
            marginTop: "1rem",
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "#008080",
            fontFamily: "sans-serif",
          }}
        >
          Loading...
        </span>
      </div>

      {/* Bottom Navigation always at the bottom */}
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100vw",
          zIndex: 100,
        }}
      >
        <BottomNav />
      </div>

      {/* Spinner CSS */}
      <style jsx>{`
        .loader-spinner {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #008080;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }
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
};

export default Loader;

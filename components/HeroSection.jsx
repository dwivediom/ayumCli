import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaSearch, FaPills, FaVial } from "react-icons/fa";
import Typewriter from "./TypeWriteAnimate";
import { cityoptions } from "../public/utils/Utils";

// Add custom scrollbar styles
const dropdownStyles = `
  .city-dropdown {
    animation: slideDown 0.2s ease-out;
  }
  .city-dropdown::-webkit-scrollbar {
    width: 6px;
  }
  .city-dropdown::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  .city-dropdown::-webkit-scrollbar-thumb {
    background: #b2f5ea;
    border-radius: 3px;
  }
  .city-dropdown::-webkit-scrollbar-thumb:hover {
    background: #008080;
  }
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroSection = ({ city, setCity, hidegreet }) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Force close dropdown if it's been open for too long (safety mechanism)
  useEffect(() => {
    if (dropdownOpen) {
      const timer = setTimeout(() => {
        setDropdownOpen(false);
      }, 10000); // Close after 10 seconds as safety

      return () => clearTimeout(timer);
    }
  }, [dropdownOpen]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Array of background images to cycle through
  const backgroundImages = [
    "url('/labbanner3.jpeg')",
    "url('/ordermedicine.jpeg')",
    "url('/labbanner2.jpeg')",
    "url('/labbanner4.jpeg')",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % backgroundImages.length
        );
        setIsTransitioning(false);
      }, 1000); // Wait 1 second before changing image
    }, 8000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, []);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    let mobile = window && window.matchMedia("(max-width: 550px)");
    setIsMobile(mobile.matches);
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".city-dropdown");
      const button = document.querySelector(".city-dropdown-button");
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target) &&
        !button.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dropdownStyles }} />
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "1rem",
          maxWidth: !isMobile ? 420 : "100%",
          minWidth: !isMobile ? "900px" : "100%",
          // marginLeft: !isMobile ? "-2px" : "0",
          margin: "auto",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(188, 246, 253, 0.81)",
        }}
      >
        {hidegreet ? (
          ""
        ) : (
          <>
            <div style={{ position: "relative" }}>
              <Typewriter text="Free 30 min Home delivery in Rewa" />
              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  fontWeight: 500,
                  zIndex: 10,
                }}
              >
                <div
                  className="city-dropdown-button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "#e6fffa",
                    color: "#008080",
                    borderRadius: "999px",
                    padding: "0.25rem 0.9rem 0.25rem 0.7rem",
                    border: "1.5px solid #b2f5ea",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(0,128,128,0.10)",
                    position: "relative",
                    minWidth: 80,
                    userSelect: "none",
                  }}
                  onClick={() => setDropdownOpen((v) => !v)}
                  onBlur={(e) => {
                    // Close dropdown when button loses focus (unless clicking on dropdown)
                    setTimeout(() => {
                      if (!e.currentTarget.contains(document.activeElement)) {
                        setDropdownOpen(false);
                      }
                    }, 150);
                  }}
                >
                  <i className="pi pi-map-marker" style={{ marginRight: 6 }} />
                  {city}
                  <span style={{ marginLeft: 8, fontSize: 14 }}>▼</span>
                  {dropdownOpen && (
                    <div
                      className="city-dropdown"
                      style={{
                        position: "absolute",
                        top: "110%",
                        right: 0,
                        background: "#fff",
                        border: "1px solid #b2f5ea",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,128,128,0.10)",
                        zIndex: 100,
                        minWidth: 120,
                        padding: "0.3rem 0",
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#b2f5ea #f0f0f0",
                      }}
                    >
                      {cityoptions
                        .map((c) => c.label)
                        .map((c) => (
                          <div
                            key={c}
                            style={{
                              padding: "0.5rem 1rem",
                              cursor: "pointer",
                              color: c === city ? "#008080" : "#333",
                              background: c === city ? "#e6fffa" : "#fff",
                              fontWeight: c === city ? 700 : 500,
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              if (c !== city) {
                                e.target.style.background = "#f0f9f8";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (c !== city) {
                                e.target.style.background = "#fff";
                              }
                            }}
                            onClick={() => {
                              setCity(c);
                              localStorage.setItem("city", c);
                              // Ensure dropdown closes immediately
                              setDropdownOpen(false);
                              // Additional safety to ensure dropdown closes
                              setTimeout(() => {
                                setDropdownOpen(false);
                              }, 50);
                            }}
                          >
                            {c}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Search Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f8f9fa",
                borderRadius: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                padding: "1rem 0.8rem",
                marginBottom: "1rem",
                marginTop: "1rem",
                border: "1px solid #e9ecef",
              }}
            >
              <FaSearch color="#6c757d" size={16} />
              <input
                type="text"
                placeholder="Search doctors, clinics, or specialties..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  marginLeft: "0.5rem",
                  fontSize: "0.98rem",
                  flex: 1,
                  padding: "0.3rem 0",
                  color: "#333",
                }}
              />
            </div>
          </>
        )}

        {/* Specialist Card with animated background */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // background: "linear-gradient(90deg, #f8f9fa 60%, #fff 100%)",
            borderRadius: "12px",
            padding: "1.8rem 1.2rem",
            marginBottom: "1rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            height: "175px",
            backgroundImage: backgroundImages[currentImageIndex],
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transition: "opacity 1s ease-in-out",
            position: "relative",
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          {/* Overlay for smooth transition effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isTransitioning
                ? "linear-gradient(90deg, rgba(248,249,250,0.3) 60%, rgba(255,255,255,0.3) 100%)"
                : "",
              borderRadius: "12px",
              pointerEvents: "none",
            }}
          />
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            {/* Content can go here */}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.2rem",
          }}
        >
          <button
            style={{
              flex: 1,
              background: "#008080",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "1.5rem 0.5",
              fontWeight: 600,
              fontSize: "1.1rem",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              boxShadow: "0 2px 8px rgba(0,128,128,0.25)",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onClick={() => {
              router.push("/medical/list");
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#006666";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0,128,128,0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#008080";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,128,128,0.25)";
            }}
          >
            <FaPills
              style={{
                width: "2rem",
                height: "2rem",
                // marginLeft: "15px",
                // marginRight: "15px",
              }}
            />{" "}
            Order Medicines
          </button>
          <button
            style={{
              flex: 1,
              background:
                "linear-gradient(90deg,rgb(3, 162, 165) 60%,rgb(0, 174, 190) 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "1.5rem 0.5",
              fontWeight: 600,
              fontSize: "1.1rem",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              gap: "1rem",
              boxShadow: "0 2px 8px rgba(32,212,169,0.25)",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onClick={() => {
              router.push("/lab");
            }}
            // onMouseEnter={(e) => {
            //   e.target.style.background =
            //     "linear-gradient(90deg, #1ba085 60%, #0f9b8a 100%)";
            //   e.target.style.transform = "translateY(-1px)";
            //   e.target.style.boxShadow = "0 4px 12px rgba(32,212,169,0.35)";
            // }}
            // onMouseLeave={(e) => {
            //   e.target.style.background =
            //     "linear-gradient(90deg, #20d4a9 60%, #14b8a6 100%)";
            //   e.target.style.transform = "translateY(0)";
            //   e.target.style.boxShadow = "0 2px 8px rgba(32,212,169,0.25)";
            // }}
          >
            <FaVial
              style={{
                width: "1.7rem",
                height: "1.7rem",
                marginLeft: "-15px",
              }}
            />{" "}
            <span>
              Book <br /> Lab Tests
            </span>
          </button>
        </div>

        {/* Category Pills */}
      </div>
    </>
  );
};

export default HeroSection;

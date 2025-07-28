import { Toast } from "primereact/toast";
import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AccountContext } from "../../context/AccountProvider";

const LoginPopupPhoneNumber = () => {
  const { showLoginPopup, setShowLoginPopup } = useContext(AccountContext);
  const toast = useRef(null);
  const handleLoginComplete = (result) => {
    console.log(result);
    setIsLoading(true);
    setShowLoginPopup(false);
    localStorage.setItem("usertoken", result?.data?.token);
    localStorage.setItem("userdata", JSON.stringify(result?.data));
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Login successful",
      life: 3000,
    });
    setIsLoading(false);
    setShowOTPInput(false);
  };

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+91",
    flag: "🇮🇳",
    name: "India",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const countries = [
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+39", flag: "🇮🇹", name: "Italy" },
    { code: "+34", flag: "🇪🇸", name: "Spain" },
    { code: "+7", flag: "🇷🇺", name: "Russia" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
    { code: "+52", flag: "🇲🇽", name: "Mexico" },
    { code: "+971", flag: "🇦🇪", name: "UAE" },
    { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "+92", flag: "🇵🇰", name: "Pakistan" },
    { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
    { code: "+977", flag: "🇳🇵", name: "Nepal" },
    { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
    { code: "+65", flag: "🇸🇬", name: "Singapore" },
    { code: "+60", flag: "🇲🇾", name: "Malaysia" },
    { code: "+66", flag: "🇹🇭", name: "Thailand" },
    { code: "+84", flag: "🇻🇳", name: "Vietnam" },
    { code: "+62", flag: "🇮🇩", name: "Indonesia" },
    { code: "+63", flag: "🇵🇭", name: "Philippines" },
  ];

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
  );

  useEffect(() => {
    if (showLoginPopup) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (panelRef.current) {
          panelRef.current.style.transform = "translateY(0)";
        }
      }, 10);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLoginPopup]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (panelRef.current) {
      panelRef.current.style.transform = "translateY(100%)";
    }
    setTimeout(() => {
      setShowLoginPopup(false);
      setPhoneNumber("");
      setShowCountryList(false);
      setSearchQuery("");
    }, 300);
  };

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter your phone number",
        life: 3000,
      });
      return;
    }

    if (phoneNumber.length < 10) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter a valid phone number",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 1500));
      //   onLogin(selectedCountry.code + phoneNumber);
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/otp/send`,
        {
          phone: selectedCountry.code + phoneNumber,
        }
      );
      if (result.data.error == false) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP sent successfully",
          life: 3000,
        });
        setShowOTPInput(true);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.data.message,
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const VerifyOTP = async (otp) => {
    if (!otp) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter OTP",
        life: 3000,
      });
      return;
    }

    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/otp/verify`,
      {
        phone: selectedCountry.code + phoneNumber,
        otp: otp,
      }
    );
    console.log(result, "otp verify response");
    if (result.data.error == false) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "OTP verified successfully",
        life: 3000,
      });
      handleLoginComplete(result?.data);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: result.data.message,
        life: 3000,
      });
    }
  };
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryList(false);
    setSearchQuery("");
    // Focus back to input after country selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleInputClick = () => {
    setShowCountryList(true);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowCountryList(false);
    }, 200);
  };

  if (!showLoginPopup) return null;

  const styles = {
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    },
    panel: {
      background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
      borderRadius: "24px 24px 0 0",
      width: "100%",
      maxWidth: "400px",
      maxHeight: "90vh",
      overflow: "hidden",
      transform: "translateY(100%)",
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 -20px 40px rgba(0, 0, 0, 0.3)",
    },
    header: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      padding: "24px 24px 16px",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    title: {
      color: "white",
      fontSize: "28px",
      fontWeight: "700",
      margin: "0 0 8px 0",
      textAlign: "center",
    },
    subtitle: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "16px",
      margin: 0,
      textAlign: "center",
    },
    form: {
      background: "white",
      padding: "32px 24px",
      borderRadius: "24px 24px 0 0",
      marginTop: "-20px",
      position: "relative",
      zIndex: 1,
    },
    label: {
      display: "block",
      color: "#111827",
      fontWeight: "600",
      fontSize: "14px",
      marginBottom: "8px",
    },
    phoneInput: {
      marginBottom: "32px",
      position: "relative",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      background: "#f8fafc",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      transition: "all 0.2s ease",
      height: "60px",
      padding: "0 16px",
      cursor: "text",
    },
    input: {
      flex: 1,
      border: "none",
      background: "transparent",
      fontSize: "16px",
      color: "#111827",
      outline: "none",
      height: "100%",
      cursor: "text",
    },
    countryDropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "white",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
      marginTop: "4px",
      maxHeight: "300px",
      overflow: "hidden",
    },
    searchBox: {
      padding: "12px",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      background: "#f8fafc",
    },
    searchInput: {
      border: "none",
      background: "transparent",
      outline: "none",
      fontSize: "14px",
      color: "#111827",
      flex: 1,
      marginLeft: "8px",
    },
    countryList: {
      maxHeight: "250px",
      overflowY: "auto",
    },
    countryOption: {
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      transition: "background 0.2s ease",
    },
    loginButton: {
      width: "100%",
      background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "16px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "16px",
      opacity: isLoading || !phoneNumber.trim() ? 0.6 : 1,
    },
    spinner: {
      animation: "spin 1s linear infinite",
    },
    terms: {
      color: "#64748b",
      fontSize: "12px",
      textAlign: "center",
      lineHeight: 1.5,
      margin: 0,
    },
    link: {
      color: "#0f766e",
      textDecoration: "none",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <Toast ref={toast} />
      <div ref={panelRef} style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <button
            style={styles.closeButton}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "scale(1)";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h3 style={styles.title}>Login with Phone</h3>
          <p className="text-sm text-white text-center">
            Enter your phone number to continue
          </p>
        </div>

        {/* Form */}
        {!showOTPInput && (
          <div style={styles.form}>
            {/* Phone Number Input */}
            <div style={styles.phoneInput}>
              <label style={styles.label}>Mobile Number</label>
              <div
                style={styles.inputWrapper}
                //   onClick={handleInputClick}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#f8fafc";
                }}
              >
                <div
                  onClick={handleInputClick}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.background = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                  }}
                  style={{
                    borderColor: "#e2e8f0",
                    background: "#f8fafc",
                    cursor: "pointer",
                  }}
                >
                  <span style={styles.flag}>{selectedCountry.flag}</span>
                  <span style={styles.countryCode}>{selectedCountry.code}</span>
                </div>
                <input
                  ref={inputRef}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter your mobile number"
                  style={{ ...styles.input, paddingLeft: "10px" }}
                  maxLength="15"
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              {/* Country Dropdown */}
              {showCountryList && (
                <div style={styles.countryDropdown}>
                  <div style={styles.searchBox}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search country..."
                      style={styles.searchInput}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div style={styles.countryList}>
                    {filteredCountries.map((country, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.countryOption,
                          background:
                            selectedCountry.code === country.code
                              ? "#f0fdfa"
                              : "transparent",
                          color:
                            selectedCountry.code === country.code
                              ? "#0f766e"
                              : "inherit",
                        }}
                        onClick={() => handleCountrySelect(country)}
                        onMouseEnter={(e) => {
                          if (selectedCountry.code !== country.code) {
                            e.target.style.background = "#f1f5f9";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCountry.code !== country.code) {
                            e.target.style.background = "transparent";
                          }
                        }}
                      >
                        <span style={{ fontSize: "20px", marginRight: "12px" }}>
                          {country.flag}
                        </span>
                        <span
                          style={{
                            color:
                              selectedCountry.code === country.code
                                ? "#0f766e"
                                : "#374151",
                            fontSize: "14px",
                            flex: 1,
                          }}
                        >
                          {country.name}
                        </span>
                        <span
                          style={{
                            color: "#6b7280",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {country.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
            <button
              style={styles.loginButton}
              onClick={handleLogin}
              disabled={isLoading || !phoneNumber.trim()}
              onMouseEnter={(e) => {
                if (!isLoading && phoneNumber.trim()) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(15, 118, 110, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && phoneNumber.trim()) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? (
                <div style={styles.spinner}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <>
                  <i className="pi pi-whatsapp"></i>
                  Get OTP On Whatsapp
                </>
              )}
            </button>

            {/* Terms */}
            <p style={styles.terms}>
              By continuing, you agree to our{" "}
              <a href="/terms" style={styles.link}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" style={styles.link}>
                Privacy Policy
              </a>
            </p>
          </div>
        )}
        {showOTPInput && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
              }}
            >
              <label
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Enter OTP
              </label>
              <input
                type="text"
                onChange={(e) => setOTP(e.target.value)}
                style={{
                  width: "20rem",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <button
                onClick={() => VerifyOTP(otp)}
                style={{
                  width: "20rem",
                  padding: "15px 10px",
                  margin: "10px 0",
                  borderRadius: "6px",
                  background:
                    "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                disabled={isLoading}
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .panel {
            max-width: 100%;
            border-radius: 20px 20px 0 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPopupPhoneNumber;

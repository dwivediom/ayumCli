import React from "react";

const pagenotfound = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "4rem",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Page Not Found - 404
      </h1>
      <a
        href="/"
        style={{
          color: "blue",
          textDecoration: "underline",
        }}
      >
        Go To Homepage
      </a>
    </div>
  );
};

export default pagenotfound;

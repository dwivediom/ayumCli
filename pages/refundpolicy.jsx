"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const Refunpolicycomp = dynamic(() => import("../components/Refunpolicycomp"), {
  ssr: false,
});

const Refundpolicy = () => {
  return (
    <>
      <Refunpolicycomp />
    </>
  );
};

export default Refundpolicy;

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import Slider2 from "../../components/AdComp3";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { useEffect } from "react";
const QuickSearch = dynamic(() => import("../../components/QuickSearch"));

const Category = () => {
  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    setscrollbox(false);
  }, []);
  return (
    <div style={{ minHeight: "100vh" }} className="overflow-scroll w-full">
      <QuickSearch />
      <Slider2 />
    </div>
  );
};

export default Category;

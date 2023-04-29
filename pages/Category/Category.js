import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import Slider2 from "../../components/AdComp3";
const QuickSearch = dynamic(() => import("../../components/QuickSearch"));

const Category = () => {
  return (
    <div className="absolute w-full">
      <QuickSearch />
      <Slider2 />
    </div>
  );
};

export default Category;

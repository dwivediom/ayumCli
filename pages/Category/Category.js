import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
const QuickSearch = dynamic(() => import("../../components/QuickSearch"));

const Category = () => {
  return (
    <div className="absolute w-full">
      <QuickSearch />
    </div>
  );
};

export default Category;

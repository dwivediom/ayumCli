import dynamic from "next/dynamic";
import React from "react";
const QuickSearch = dynamic(() => import("../../components/QuickSearch"));

const Category = () => {
  return (
    <div>
      <QuickSearch />
    </div>
  );
};

export default Category;

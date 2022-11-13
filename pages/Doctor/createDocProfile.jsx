import dynamic from "next/dynamic";
import React from "react";
const CreateDocProfile = dynamic(() => import(CreateDocProfile));

const createDocProfile = () => {
  return (
    <>
      <CreateDocProfile />
    </>
  );
};

export default createDocProfile;

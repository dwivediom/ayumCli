import React from "react";
import PharmacyList from "../../components/medical/PharmacyList";
import WithAuth from "../../components/Withauth";
const MedicalPage = () => {
  return (
    <div>
      <PharmacyList />
    </div>
  );
};

export default WithAuth(MedicalPage);

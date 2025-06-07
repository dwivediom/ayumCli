import React from "react";
import PharmacyList from "../../components/medical/PharmacyList";
import WithAuth from "../../components/WithAuth";
const MedicalPage = () => {
  return (
    <div>
      <PharmacyList />
    </div>
  );
};

export default WithAuth(MedicalPage);

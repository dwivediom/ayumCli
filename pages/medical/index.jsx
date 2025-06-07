import React from "react";
import PharmacyList from "../../components/medical/PharmacyList";
import WithAuth1 from "../../components/WithAuth1";
const MedicalPage = () => {
  return (
    <div>
      <PharmacyList />
    </div>
  );
};

export default WithAuth1(MedicalPage);

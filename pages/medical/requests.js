import React from "react";
import MedicineRequests from "../../components/medical/MedicineRequests";
import WithAuth1 from "../../components/WithAuth1";
const MedicalRequestsPage = () => {
  // with auth
  return (
    <div>
      <MedicineRequests />
    </div>
  );
};

export default WithAuth1(MedicalRequestsPage);

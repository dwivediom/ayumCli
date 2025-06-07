import React from "react";
import MedicineRequests from "../../components/medical/MedicineRequests";
import WithAuth from "../../components/WithAuth";
const MedicalRequestsPage = () => {
  // with auth
  return (
    <div>
      <MedicineRequests />
    </div>
  );
};

export default WithAuth(MedicalRequestsPage);

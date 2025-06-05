import React from "react";
import MedicineRequests from "../../components/medical/MedicineRequests";
import WithAuth from "../../components/Withauth";
const MedicalRequestsPage = () => {
  // with auth
  return (
    <div>
      <MedicineRequests />
    </div>
  );
};

export default WithAuth(MedicalRequestsPage);

import React from "react";
import MedicineRequests from "../../components/medical/MedicineRequests";
import { getServerSideProps } from "../index";
import withAuth from "../../components/withAuth";

const MedicalRequestsPage = () => {
  // with auth
  return (
    <div>
      <MedicineRequests />
    </div>
  );
};

export default withAuth(MedicalRequestsPage);

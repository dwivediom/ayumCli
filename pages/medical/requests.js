import React from 'react';
import MedicineRequests from '../../components/medical/MedicineRequests';
import { getServerSideProps } from '../index';

const MedicalRequestsPage = () => {
  return (
    <div>
      <MedicineRequests />
    </div>
  );
};

export default MedicalRequestsPage; 
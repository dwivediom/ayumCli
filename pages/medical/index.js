import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import PharmacyList from '../../components/medical/PharmacyList';
import styles from '../../styles/Medical.module.css';

const MedicalPage = () => {
  const router = useRouter();
  const [showPharmacyList, setShowPharmacyList] = useState(false);

  const handlePharmacySelect = (pharmacy) => {
    router.push(`/medical/pharmacy/${pharmacy._id}`);
  };

  return (
    <div className={styles.medicalPage}>
      <div className={styles.header}>
        <h1>Medical Services</h1>
        <div className={styles.actions}>
          <Button
            label="View Requests"
            icon="pi pi-list"
            onClick={() => router.push('/medical/requests')}
            className="p-button-outlined"
          />
          <Button
            label="Find Pharmacy"
            icon="pi pi-search"
            onClick={() => setShowPharmacyList(true)}
            className="p-button-primary"
          />
        </div>
      </div>

      {showPharmacyList && (
        <PharmacyList onPharmacySelect={handlePharmacySelect} />
      )}
    </div>
  );
};

export default MedicalPage; 
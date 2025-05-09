import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import styles from './styles.module.css';
import { getAuthHeaders } from '../../config/api/labApi';
import MedicineSelection from './MedicineSelection';

const PharmacyList = () => {
  const toast = useRef(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('Rewa');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showMedicineSelection, setShowMedicineSelection] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchPharmacies();
  }, [city]);

  const fetchPharmacies = async (search = '') => {
    try {
      setLoading(true);
      
      const params = search ? { searchTerm: search } : { city };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/pharmacies`,
        {
          params,
          headers: getAuthHeaders()
        }
      );
      
      if (response.data) {
        setPharmacies(response.data.pharmacies || []);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        });
      } else {
        setPharmacies([]);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch pharmacies',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setPharmacies([]);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch pharmacies. Please try again.',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPharmacies(searchTerm);
  };

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowMedicineSelection(true);
  };

  const handleMedicinesSelected = (selectedMedicines) => {
    // Handle the selected medicines here
    console.log('Selected medicines:', selectedMedicines);
    // You can add your logic here to process the selected medicines
    setShowMedicineSelection(false);
    setSelectedPharmacy(null);
  };

  const itemTemplate = (pharmacy) => {
    return (
      <div className={styles.pharmacyCard}>
        <div className={styles.pharmacyHeader}>
          <h3>{pharmacy.name}</h3>
          <Tag value={pharmacy.hospital} severity="info" />
        </div>
        
        <div className={styles.pharmacyDetails}>
          <div className={styles.detailItem}>
            <i className="pi pi-building" style={{ fontSize: '1rem', color: '#2196F3' }}></i>
            <span>{pharmacy.hospital}</span>
          </div>
          <div className={styles.detailItem}>
            <i className="pi pi-map-marker" style={{ fontSize: '1rem', color: '#4CAF50' }}></i>
            <span>{pharmacy.city}</span>
          </div>
        </div>
        
        <div className={styles.pharmacyActions}>
          <Button 
            label="Select" 
            icon="pi pi-check" 
            className="p-button-success"
            onClick={() => handlePharmacySelect(pharmacy)}
          />
          <Button 
            label="Contact" 
            icon="pi pi-phone" 
            className="p-button-outlined"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pharmacyList}>
      <Toast ref={toast} />
      
      {!showMedicineSelection ? (
        <>
          <div className={styles.searchSection}>
            <div className={styles.searchInput}>
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pharmacies..."
                className="w-full"
              />
              <Button
                label="Search"
                icon="pi pi-search"
                onClick={handleSearch}
              />
            </div>
            
            <div className={styles.cityInput}>
              <InputText
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full"
              />
              <Button
                label="Filter by City"
                icon="pi pi-filter"
                onClick={() => fetchPharmacies()}
              />
            </div>
          </div>

          <DataView
            value={pharmacies}
            itemTemplate={itemTemplate}
            paginator
            rows={10}
            totalRecords={pagination.total}
            loading={loading}
            className={styles.pharmacyDataView}
          />
        </>
      ) : (
        <MedicineSelection
          pharmacyId={selectedPharmacy._id}
          onMedicinesSelected={handleMedicinesSelected}
        />
      )}
    </div>
  );
};

export default PharmacyList; 
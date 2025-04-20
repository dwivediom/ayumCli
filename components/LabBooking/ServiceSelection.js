import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import styles from './styles.module.css';
import { labTestApi, getAuthHeaders, handleApiError } from '../../config/api/labApi';

const ServiceSelection = ({ onTestsSelected }) => {
  const toast = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [city, setCity] = useState('Mumbai'); // Default city
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  useEffect(() => {
    fetchCategories();
    fetchAllTests();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        labTestApi.getTestCategories(),
        {
          headers: getAuthHeaders()
        }
      );
      
      if (response.data && !response.data.error) {
        setCategories(response.data.data || []);
      } else {
        setCategories([]);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.data.message || 'Failed to fetch test categories',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching test categories:', error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorResult.message || 'Failed to fetch test categories',
        life: 3000
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTests = async () => {
    try {
      setLoading(true);
      
      // Prepare query parameters
      const params = {};
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      if (searchText) {
        params.search = searchText;
      }
      
      const response = await axios.get(
        labTestApi.getAllOfferedTests(params),
        {
          params,
          headers: getAuthHeaders()
        }
      );
      
      if (response.data && !response.data.error) {
        setTests(response.data.data || []);
      } else {
        setTests([]);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.data.message || 'Failed to fetch tests',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorResult.message || 'Failed to fetch tests',
        life: 3000
      });
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelection = (test) => {
    const isSelected = selectedTests.some(t => t.testTemplateId === test.testTemplateId);
    
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t.testTemplateId !== test.testTemplateId));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleProceed = () => {
    if (selectedTests.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one test',
        life: 3000
      });
      return;
    }
    
    // Pass the city along with the selected tests
    onTestsSelected(selectedTests, city);
  };

  const itemTemplate = (test) => {
    const isSelected = selectedTests.some(t => t.testTemplateId === test.testTemplateId);
    
    return (
      <div className={`${styles.testCard} ${isSelected ? styles.selected : ''}`}>
        <div className={styles.testHeader}>
          <h3>{test.testName}</h3>
          <Checkbox 
            checked={isSelected} 
            onChange={() => handleTestSelection(test)}
            className={styles.testCheckbox}
          />
        </div>
        
        <div className={styles.testDetails}>
          <p><strong>Sample Requirements:</strong> {test.sampleRequirements}</p>
          
          <div className={styles.labList}>
            <h4>Available at:</h4>
            {test.offeredBy && test.offeredBy.map((lab, index) => (
              <div key={index} className={styles.labItem}>
                <span className={styles.labName}>{lab.labName}</span>
                <div className={styles.labInfo}>
                  <Tag value={`₹${lab.price}`} severity="success" />
                  {lab.discountOffered > 0 && (
                    <Tag value={`${lab.discountOffered}% OFF`} severity="warning" />
                  )}
                  <Tag value={lab.turnaroundTime} severity="info" />
                  {lab.homeCollectionAvailable && (
                    <Tag value="Home Collection" severity="primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.serviceSelection}>
      <Toast ref={toast} />
      <div className={styles.searchSection}>
        <Dropdown
          value={selectedCategory}
          options={categories}
          onChange={(e) => setSelectedCategory(e.value)}
          placeholder="Select Test Category"
          className="w-full"
          filter
        />
        <InputText
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
          className="w-full"
        />
        <InputText
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Tests"
          className="w-full"
        />
        <Button
          label="Search"
          icon="pi pi-search"
          onClick={fetchAllTests}
          className="w-full"
        />
      </div>

      <DataView
        value={tests}
        itemTemplate={itemTemplate}
        paginator
        rows={10}
        totalRecords={pagination.total}
        loading={loading}
        className={styles.testDataView}
      />

      {selectedTests.length > 0 && (
        <div className={styles.selectedTestsSummary}>
          <h3>Selected Tests ({selectedTests.length})</h3>
          <div className={styles.selectedTestsList}>
            {selectedTests.map(test => (
              <div key={test.testTemplateId} className={styles.selectedTestItem}>
                <span>{test.testName}</span>
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() => handleTestSelection(test)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actionButtons}>
        <Button
          label="Proceed to Lab Selection"
          icon="pi pi-arrow-right"
          onClick={handleProceed}
          disabled={selectedTests.length === 0}
        />
      </div>
    </div>
  );
};

export default ServiceSelection; 
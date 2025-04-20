import React, { useState, useEffect, useRef } from 'react';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './styles.module.css';
import { labTestApi, getAuthHeaders, handleApiError } from '../../config/api/labApi';

const LabList = ({ selectedTests, city, onLabSelected }) => {
  const toast = useRef(null);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLab, setSelectedLab] = useState(null);
  const [summary, setSummary] = useState({
    totalLabs: 0,
    totalTests: 0,
    totalPrice: 0
  });
  const router = useRouter();

  useEffect(() => {
    if (selectedTests.length > 0) {
      checkTestAvailability();
    }
  }, [selectedTests, city]);

  const checkTestAvailability = async () => {
    try {
      setLoading(true);
      
      // Format the tests array according to the API requirements
      const formattedTests = selectedTests.map(test => ({
        name: test.testName,
        templateId: test.testTemplateId
      }));
      
      const response = await axios.post(
        labTestApi.checkTestAvailability(), 
        {
          tests: formattedTests,
          location: {
            city: city
          }
        },
        {
          headers: getAuthHeaders()
        }
      );

      if (response.data && !response.data.error) {
        // Transform the API response to match our component's expected format
        const transformedLabs = response.data.data.map(lab => ({
          _id: lab.labId,
          labId: lab.labId,
          name: lab.labName,
          labType: lab.labType,
          city: lab.city,
          address: lab.address || 'Address not available',
          phone: lab.phone || 'Phone not available',
          totalPrice: lab.pricing?.totalPrice || 0,
          homeCollectionAvailable: lab.availableTests.some(test => test.homeCollectionAvailable),
          availableTests: lab.availableTests.map(test => ({
            testName: test.name,
            testTemplateId: test.templateId,
            price: test.price,
            discountOffered: test.discountOffered || 0,
            turnaroundTime: test.turnaroundTime,
            sampleRequirements: test.sampleRequirements,
            additionalInfo: test.additionalInfo
          })),
          unavailableTests: lab.unavailableTests.map(test => ({
            name: test.name,
            reason: test.reason
          })),
          availability: lab.availability
        }));
        
        setLabs(transformedLabs);
        setSummary({
          totalLabs: response.data.summary?.totalLabs || 0,
          totalTests: selectedTests.length,
          totalPrice: transformedLabs.reduce((total, lab) => total + (lab.totalPrice || 0), 0)
        });
      } else {
        setLabs([]);
        setSummary({
          totalLabs: 0,
          totalTests: selectedTests.length,
          totalPrice: 0
        });
      }
    } catch (error) {
      console.error('Error checking test availability:', error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorResult.message || 'Failed to check test availability',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLabSelection = (lab) => {
    setSelectedLab(lab);
  };

  const handleProceed = () => {
    if (!selectedLab) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a lab',
        life: 3000
      });
      return;
    }
    onLabSelected(selectedLab);
  };

  const itemTemplate = (lab) => {
    const isSelected = selectedLab && selectedLab._id === lab._id;
    const availabilityPercentage = lab.availability?.percentage || 0;
    const availabilityColor = availabilityPercentage === 100 ? 'success' : 
                             availabilityPercentage >= 50 ? 'warning' : 'danger';
    
    return (
      <div className={`${styles.labCard} ${isSelected ? styles.selected : ''}`}>
        <div className={styles.labHeader}>
          <div className={styles.labTitle}>
            <h3>{lab.name}</h3>
            <span className={`${styles.labType} ${styles[lab.labType]}`}>
              {lab.labType === 'hospital' ? 'Hospital' : 'Lab'}
            </span>
          </div>
          <div className={styles.labCheckbox}>
            <input 
              type="radio" 
              id={`lab-${lab._id}`} 
              name="selectedLab" 
              checked={isSelected}
              onChange={() => handleLabSelection(lab)}
            />
            <label htmlFor={`lab-${lab._id}`}>Select this lab</label>
          </div>
        </div>
        
        <div className={styles.labDetails}>
          <div className={styles.labInfo}>
            <div className={styles.labInfoItem}>
              <i className="pi pi-map-marker"></i>
              <span>{lab.address}</span>
            </div>
            <div className={styles.labInfoItem}>
              <i className="pi pi-phone"></i>
              <span>{lab.phone}</span>
            </div>
            <div className={styles.labInfoItem}>
              <i className="pi pi-map"></i>
              <span>{lab.city}</span>
            </div>
          </div>
          
          <div className={styles.availabilitySection}>
            <h4>Test Availability</h4>
            <div className={styles.availabilityBar}>
              <div 
                className={`${styles.availabilityProgress} ${styles[availabilityColor]}`} 
                style={{ width: `${availabilityPercentage}%` }}
              ></div>
            </div>
            <p className={styles.availabilityText}>
              {lab.availability?.available || 0} of {lab.availability?.total || 0} tests available ({availabilityPercentage}%)
            </p>
          </div>
          
          <div className={styles.testList}>
            <h4>Available Tests:</h4>
            {lab.availableTests && lab.availableTests.map((test, index) => (
              <div key={index} className={styles.testItem}>
                <div className={styles.testHeader}>
                  <span className={styles.testName}>{test.testName}</span>
                  <div className={styles.testInfo}>
                    <span className={styles.testPrice}>₹{test.price}</span>
                    {test.discountOffered > 0 && (
                      <span className={styles.discount}>{test.discountOffered}% OFF</span>
                    )}
                  </div>
                </div>
                <div className={styles.testDetails}>
                  <span className={styles.testDetail}>
                    <i className="pi pi-clock"></i> {test.turnaroundTime}
                  </span>
                  <span className={styles.testDetail}>
                    <i className="pi pi-info-circle"></i> {test.sampleRequirements}
                  </span>
                  {test.homeCollectionAvailable && (
                    <span className={styles.homeCollection}>
                      <i className="pi pi-home"></i> Home Collection Available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {lab.unavailableTests && lab.unavailableTests.length > 0 && (
            <div className={styles.unavailableTests}>
              <h4>Unavailable Tests:</h4>
              <ul>
                {lab.unavailableTests.map((test, index) => (
                  <li key={index} className={styles.unavailableTest}>
                    <i className="pi pi-times-circle"></i> {test.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className={styles.labSummary}>
            <div className={styles.priceInfo}>
              <span className={styles.priceLabel}>Total Price:</span>
              <span className={styles.priceValue}>₹{lab.totalPrice}</span>
            </div>
            <div className={styles.turnaroundInfo}>
              <span className={styles.turnaroundLabel}>Max Turnaround:</span>
              <span className={styles.turnaroundValue}>{lab.pricing?.maxTurnaroundTime || '24 hours'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.labList}>
      <Toast ref={toast} />
      
      <div className={styles.summaryCard}>
        <h3>Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Labs</span>
            <span className={styles.summaryValue}>{summary.totalLabs}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Tests</span>
            <span className={styles.summaryValue}>{summary.totalTests}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Price</span>
            <span className={styles.summaryValue}>₹{summary.totalPrice}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.searchSection}>
        <InputText 
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)} 
          placeholder="Search Labs"
          className="w-full"
        />
      </div>
      
      <DataView 
        value={labs.filter(lab => 
          !searchText || 
          lab.name.toLowerCase().includes(searchText.toLowerCase()) ||
          lab.address.toLowerCase().includes(searchText.toLowerCase())
        )}
        itemTemplate={itemTemplate} 
        paginator 
        rows={10}
        loading={loading}
        className={styles.labDataView}
      />
      
      {selectedLab && (
        <div className={styles.selectedLabSummary}>
          <h3>Selected Lab</h3>
          <div className={styles.selectedLabDetails}>
            <p><strong>Name:</strong> {selectedLab.name}</p>
            <p><strong>Address:</strong> {selectedLab.address}</p>
            <p><strong>Phone:</strong> {selectedLab.phone}</p>
            <p><strong>Total Price:</strong> ₹{selectedLab.totalPrice}</p>
          </div>
          <div className={styles.actionButtons}>
            <Button 
              label="Proceed to Booking" 
              icon="pi pi-arrow-right" 
              onClick={handleProceed}
              disabled={!selectedLab}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LabList; 
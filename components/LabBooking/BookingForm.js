import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import styles from './styles.module.css';
import { getCurrentLocationAndAddress, savePreciseLocation, getSavedPreciseLocation } from '../../utils/locationUtils';
import { labBookingApi, getAuthHeaders, handleApiError } from '../../config/api/labApi';

const BookingForm = ({ selectedLab, selectedTests, onBookingComplete, loading }) => {
  const toast = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    age: null,
    gender: 'male',
    phone: '',
    email: '',
    homeCollection: false,
    date: null,
    time: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  
  const [addressData, setAddressData] = useState({
    street: '',
    houseNumber: '',
    suburb: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    formattedAddress: ''
  });
  
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    timestamp: null
  });
  
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [usePreciseLocation, setUsePreciseLocation] = useState(true);
  
  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_B_PORT || 'http://localhost:5001';

  // Generate default time slots from 8 AM to 8 PM in 1-hour intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const formattedHour = hour < 12 ? `${hour}:00 AM` : 
                           hour === 12 ? `12:00 PM` : 
                           `${hour - 12}:00 PM`;
      slots.push({
        label: formattedHour,
        value: formattedHour
      });
    }
    return slots;
  };

  // Set default time slots on component mount
  React.useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);

  // Check for saved location on component mount
  useEffect(() => {
    const savedLocation = getSavedPreciseLocation();
    if (savedLocation.success) {
      setLocationData(savedLocation.location);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHomeCollectionChange = async (e) => {
    const isHomeCollection = e.checked;
    setFormData(prev => ({ ...prev, homeCollection: isHomeCollection }));
    
    if (isHomeCollection) {
      // Request location permission when home collection is selected
      setLocationLoading(true);
      setLocationError('');
      
      try {
        const result = await getCurrentLocationAndAddress();
        
        if (result.success) {
          setAddressData(result.address);
          setLocationData(result.location);
          setUsePreciseLocation(true);
          
          // Save the precise location to localStorage
          const saveResult = savePreciseLocation(result.location);
          if (saveResult.success) {
            toast.current.show({
              severity: 'success',
              summary: 'Location Retrieved',
              detail: 'Your location has been successfully retrieved and saved',
              life: 3000
            });
          } else {
            console.warn('Failed to save location:', saveResult.error);
          }
        } else {
          setLocationError(result.error);
          setUsePreciseLocation(false);
          toast.current.show({
            severity: 'error',
            summary: 'Location Error',
            detail: result.error,
            life: 3000
          });
        }
      } catch (error) {
        setLocationError('Failed to get location. Please enter your address manually.');
        setUsePreciseLocation(false);
        toast.current.show({
          severity: 'error',
          summary: 'Location Error',
          detail: 'Failed to get location. Please enter your address manually.',
          life: 3000
        });
      } finally {
        setLocationLoading(false);
      }
    }
  };

  const handleUsePreciseLocationChange = (e) => {
    setUsePreciseLocation(e.checked);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.gender || !formData.phone) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields (Name, Age, Gender, Phone)',
        life: 3000
      });
      return;
    }

    const authToken = localStorage.getItem('usertoken');
    
    if (!authToken) {
      toast.current.show({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'Please log in to continue',
        life: 3000
      });
      return;
    }

    // Check if labId is available
    if (!selectedLab) {
      toast.current.show({
        severity: 'error',
        summary: 'Lab Selection Error',
        detail: 'Please select a lab before booking',
        life: 3000
      });
      return;
    }

    // Get the labId from the selected lab
    const labId = selectedLab.labId;
    
    if (!labId) {
      console.error('Selected lab data:', selectedLab);
      toast.current.show({
        severity: 'error',
        summary: 'Lab ID Error',
        detail: 'Lab ID is missing. Please try selecting the lab again.',
        life: 3000
      });
      return;
    }

    // Prepare the booking request body according to the API specification
    const bookingDetails = {
      labId: labId,
      packageIds: selectedTests.map(test => test.testTemplateId),
      homeCollection: {
        required: formData.homeCollection
      },
      patientDetails: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender || "male",
        phone: formData.phone,
        email: formData.email || ""
      }
    };

    // Add preferred slot if date is selected
    if (formData.date) {
      bookingDetails.preferredSlot = {
        date: formData.date.toISOString().split('T')[0],
        time: formData.time || "10:00 AM"
      };
    }

    // Add address and coordinates to patient details if home collection is selected
    if (formData.homeCollection) {
      // If using precise location, we can skip address validation
      if (usePreciseLocation && locationData.latitude && locationData.longitude) {
        bookingDetails.patientDetails.address = addressData.formattedAddress || 
          `${addressData.street}, ${addressData.houseNumber}, ${addressData.suburb}, ${addressData.city}, ${addressData.state} - ${addressData.postalCode}`;
        
        bookingDetails.patientDetails.coordinates = {
          latitude: locationData.latitude,
          longitude: locationData.longitude
        };
      } else {
        // If not using precise location, we need to validate the address
        if (!addressData.street || !addressData.city) {
          toast.current.show({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please provide at least street and city for home collection',
            life: 3000
          });
          return;
        }
        
        bookingDetails.patientDetails.address = addressData.formattedAddress || 
          `${addressData.street}, ${addressData.houseNumber}, ${addressData.suburb}, ${addressData.city}, ${addressData.state} - ${addressData.postalCode}`;
      }
    }

    try {
      setFormLoading(true);
      
      // Log the payload for debugging
      console.log('Selected lab:', selectedLab);
      console.log('Booking payload:', JSON.stringify(bookingDetails, null, 2));
      
      const response = await axios.post(
        labBookingApi.createBooking(),
        bookingDetails,
        {
          headers: getAuthHeaders()
        }
      );
      
      if (response.data && !response.data.error) {
        toast.current.show({
          severity: 'success',
          summary: 'Booking Successful',
          detail: 'Your lab test has been booked successfully',
          life: 3000
        });
        
        // Call the parent component's callback with a flag to indicate the API call was already made
        onBookingComplete(bookingDetails, true);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Booking Failed',
          detail: response.data.message || 'Failed to create booking',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Log the error response for debugging
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Booking Failed',
        detail: errorResult.message || 'Failed to create booking',
        life: 3000
      });
    } finally {
      setFormLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    // Use the total price from the lab's pricing information
    return selectedLab.pricing ? selectedLab.pricing.totalPrice : 0;
  };

  return (
    <div className={styles.bookingForm}>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Patient Name *</label>
            <InputText
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className={styles.formField}>
            <label>Age *</label>
            <InputNumber
              name="age"
              value={formData.age}
              onValueChange={(e) => setFormData(prev => ({ ...prev, age: e.value }))}
              className="w-full"
            />
          </div>

          <div className={styles.formField}>
            <label>Gender *</label>
            <Dropdown
              name="gender"
              value={formData.gender}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" }
              ]}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.value }))}
              placeholder="Select gender"
              className="w-full"
            />
          </div>

          <div className={styles.formField}>
            <label>Phone Number *</label>
            <InputText
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className={styles.formField}>
            <label>Email</label>
            <InputText
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="Enter email address"
              className="w-full"
            />
          </div>

          <div className={styles.formField}>
            <label>Preferred Date</label>
            <Calendar
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.value }))}
              minDate={new Date()}
              className="w-full"
            />
          </div>

          <div className={styles.formField}>
            <label>Preferred Time</label>
            <Dropdown
              value={formData.time}
              options={timeSlots}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.value }))}
              placeholder="Select Time"
              className="w-full"
              filter
              showClear
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="homeCollection">Home Collection</label>
            <div className={styles.checkboxContainer}>
              <Checkbox
                id="homeCollection"
                checked={formData.homeCollection}
                onChange={handleHomeCollectionChange}
              />
              <label htmlFor="homeCollection" className={styles.checkboxLabel}>
                I want home collection service
              </label>
            </div>
          </div>
        </div>

        {formData.homeCollection && (
          <div className={styles.addressSection}>
            <h3>Collection Address</h3>
            
            {locationLoading ? (
              <div className={styles.loadingContainer}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                <p>Getting your location...</p>
              </div>
            ) : locationError ? (
              <div className={styles.errorContainer}>
                <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: 'var(--red-500)' }}></i>
                <p>{locationError}</p>
              </div>
            ) : locationData.latitude && locationData.longitude ? (
              <div className={styles.locationInfo}>
                <i className="pi pi-map-marker" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                <p>Precise location: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}</p>
                {locationData.timestamp && (
                  <p className={styles.locationTimestamp}>
                    Retrieved: {new Date(locationData.timestamp).toLocaleString()}
                  </p>
                )}
                
                <div className={styles.checkboxContainer}>
                  <Checkbox
                    id="usePreciseLocation"
                    checked={usePreciseLocation}
                    onChange={handleUsePreciseLocationChange}
                  />
                  <label htmlFor="usePreciseLocation" className={styles.checkboxLabel}>
                    Use precise location for collection
                  </label>
                </div>
              </div>
            ) : null}
            
            <div className={styles.addressGrid}>
              <div className={styles.formField}>
                <label htmlFor="street">Street</label>
                <InputText
                  id="street"
                  name="street"
                  value={addressData.street}
                  onChange={handleAddressChange}
                  required={!usePreciseLocation}
                  placeholder="Enter street name"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="houseNumber">House/Building Number</label>
                <InputText
                  id="houseNumber"
                  name="houseNumber"
                  value={addressData.houseNumber}
                  onChange={handleAddressChange}
                  required={!usePreciseLocation}
                  placeholder="Enter house/building number"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="suburb">Suburb/Area</label>
                <InputText
                  id="suburb"
                  name="suburb"
                  value={addressData.suburb}
                  onChange={handleAddressChange}
                  required={!usePreciseLocation}
                  placeholder="Enter suburb/area"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="city">City</label>
                <InputText
                  id="city"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  required={!usePreciseLocation}
                  placeholder="Enter city"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="state">State</label>
                <InputText
                  id="state"
                  name="state"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  required={!usePreciseLocation}
                  placeholder="Enter state"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="postalCode">Postal Code</label>
                <InputText
                  id="postalCode"
                  name="postalCode"
                  value={addressData.postalCode}
                  onChange={handleAddressChange}
                  required={!usePreciseLocation}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
            
            <div className={styles.formField}>
              <label htmlFor="formattedAddress">Full Address</label>
              <InputText
                id="formattedAddress"
                name="formattedAddress"
                value={addressData.formattedAddress}
                onChange={handleAddressChange}
                required={!usePreciseLocation}
                className={styles.fullWidth}
                placeholder="Enter complete address"
              />
            </div>
            
            {usePreciseLocation && locationData.latitude && locationData.longitude && (
              <div className={styles.addressNote}>
                <i className="pi pi-info-circle" style={{ color: 'var(--primary-color)' }}></i>
                <p>Address fields are optional when using precise location. You can still fill them in for reference.</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.summary}>
          <h3>Booking Summary</h3>
          <div className={styles.labInfo}>
            <p><strong>Lab:</strong> {selectedLab.labName}</p>
            <p><strong>City:</strong> {selectedLab.city}</p>
            {selectedLab.homeCollectionAvailable && (
              <Tag value="Home Collection Available" severity="success" />
            )}
          </div>
          
          <div className={styles.testSummary}>
            <h4>Selected Tests:</h4>
            <ul>
              {selectedLab.availableTests && selectedLab.availableTests.map(test => (
                <li key={test.templateId} className={styles.testItem}>
                  <span className={styles.testName}>{test.name}</span>
                  <div className={styles.testPrice}>
                    <span className={styles.originalPrice}>₹{test.price}</span>
                    {test.discountOffered > 0 && (
                      <>
                        <span className={styles.discount}>-{test.discountOffered}%</span>
                        <span className={styles.finalPrice}>
                          ₹{test.price - (test.price * test.discountOffered / 100)}
                        </span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            
            <div className={styles.totalPrice}>
              <strong>Total Price:</strong> ₹{calculateTotalPrice()}
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <Button
            type="submit"
            label="Confirm Booking"
            icon="pi pi-check"
            loading={loading || formLoading}
            className="w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 
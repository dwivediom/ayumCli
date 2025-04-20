import React, { useState, useEffect, useRef } from 'react';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import styles from './styles.module.css';
import { labBookingApi, getAuthHeaders, handleApiError } from '../../config/api/labApi';

const BookingList = () => {
  const toast = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [showTestResults, setShowTestResults] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    fromDate: null,
    toDate: null,
    page: 1,
    limit: 10
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedTestResult, setSelectedTestResult] = useState(null);
  const [showTestResultDetails, setShowTestResultDetails] = useState(false);
  const [loadingTestResult, setLoadingTestResult] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_B_PORT || 'http://localhost:5001';
  const apiUrl = `${baseUrl}/api/lab/user`;

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Get the base URL from environment variable
      const apiUrl = labBookingApi.getUserBookings();
      
      const response = await axios.get(apiUrl, {
        headers: getAuthHeaders()
      });
      
      if (response.data && !response.data.error) {
        setBookings(response.data.data || []);
      } else {
        setBookings([]);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.data.message || 'Failed to fetch bookings',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorResult.message || 'Failed to fetch bookings',
        life: 3000
      });
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      setLoadingDetails(true);
      
      const response = await axios.get(
        labBookingApi.getBookingDetails(bookingId),
        {
          headers: getAuthHeaders()
        }
      );
      
      if (response.data && !response.data.error) {
        setSelectedBooking(response.data.data);
        setShowDetails(true);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.data.message || 'Failed to fetch booking details',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorResult.message || 'Failed to fetch booking details',
        life: 3000
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchTestResultDetails = async (resultId) => {
    try {
      setLoadingTestResult(true);
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
      
      const response = await axios.get(`${apiUrl}/result/details?resultId=${resultId}`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      
      if (response.data && !response.data.error) {
        setSelectedTestResult(response.data.data);
        setShowTestResultDetails(true);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch test result details',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching test result details:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch test result details',
        life: 3000
      });
    } finally {
      setLoadingTestResult(false);
    }
  };

  const fetchTestResults = async () => {
    try {
      setLoading(true);
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
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.fromDate) queryParams.append('fromDate', formatDateForAPI(filters.fromDate));
      if (filters.toDate) queryParams.append('toDate', formatDateForAPI(filters.toDate));
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);
      
      const response = await axios.get(`${apiUrl}/results/list?${queryParams.toString()}`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      
      if (response.data && !response.data.error) {
        setTestResults(response.data.data || []);
        setTotalRecords(response.data.total || 0);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch test results',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch test results',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const getStatusSeverity = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const viewBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
    await fetchBookingDetails(booking._id);
  };

  const viewTestResult = (resultId) => {
    fetchTestResultDetails(resultId);
  };

  const viewTestResults = () => {
    setShowTestResults(true);
    fetchTestResults();
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (event) => {
    setFilters(prev => ({
      ...prev,
      page: Math.floor(event.first / event.rows) + 1
    }));
  };

  const itemTemplate = (booking) => {
    return (
      <div className={styles.bookingCard}>
        <div className={styles.bookingHeader}>
          <div className={styles.bookingInfo}>
            <h3>{typeof booking.labId === 'object' ? booking.labId.name : 'Lab Name'}</h3>
            <p className={styles.bookingId}>Booking ID: {booking._id}</p>
            <p className={styles.bookingDate}>Date: {formatDate(booking.createdAt)}</p>
            <p className={styles.patientName}>
              <i className="pi pi-user"></i> Patient: {booking.patientDetails?.name || 'N/A'}
            </p>
            <p className={styles.testCount}>
              <i className="pi pi-list"></i> Tests: {booking.testsRequested?.length || 0}
            </p>
          </div>
          <div className={styles.bookingStatus}>
            <Tag 
              value={booking.status || 'pending'} 
              severity={getStatusSeverity(booking.status)}
            />
          </div>
        </div>
        
        <div className={styles.bookingTests}>
          <h4>Tests:</h4>
          <ul>
            {booking.testsRequested?.map((test, index) => (
              <li key={index} className={styles.testItem}>
                <span className={styles.testName}>{typeof test === 'object' ? test.name : 'Unknown Test'}</span>
                {test.status === 'completed' && test.testResultId && (
                  <Button 
                    label="View Result" 
                    icon="pi pi-file" 
                    onClick={() => viewTestResult(test.testResultId)}
                    className="p-button-text p-button-sm"
                    style={{ marginLeft: '10px' }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.bookingFooter}>
          <div className={styles.bookingPrice}>
            <strong>Total Amount:</strong> ₹{typeof booking.payment === 'object' ? booking.payment.totalAmount : 0}
          </div>
          <Button 
            label="View Details" 
            icon="pi pi-eye" 
            onClick={() => viewBookingDetails(booking)}
            className="p-button-outlined"
          />
        </div>
      </div>
    );
  };

  const testResultTemplate = (result) => {
    return (
      <div className={styles.bookingCard}>
        <div className={styles.bookingHeader}>
          <div className={styles.bookingInfo}>
            <h3>{result.testName || 'Test Name'}</h3>
            <p>Result ID: {result._id}</p>
            <p>Date: {formatDate(result.createdAt)}</p>
          </div>
          <div className={styles.bookingStatus}>
            <Tag 
              value={result.status || 'pending'} 
              severity={getStatusSeverity(result.status)}
            />
          </div>
        </div>
        
        <div className={styles.bookingTests}>
          <h4>Result Details:</h4>
          <div className={styles.resultDetails}>
            {result.resultDetails ? (
              <div dangerouslySetInnerHTML={{ __html: result.resultDetails }} />
            ) : (
              <p>No result details available</p>
            )}
          </div>
        </div>
        
        <div className={styles.bookingFooter}>
          <div className={styles.bookingPrice}>
            <strong>Lab:</strong> {result.labName || 'Unknown Lab'}
          </div>
          <Button 
            label="Download Report" 
            icon="pi pi-download" 
            onClick={() => window.open(result.reportUrl, '_blank')}
            className="p-button-outlined"
            disabled={!result.reportUrl}
          />
        </div>
      </div>
    );
  };

  const bookingDetailsDialog = () => {
    if (!selectedBooking) return null;
    
    return (
      <Dialog 
        header="Booking Details" 
        visible={showDetails} 
        onHide={() => setShowDetails(false)}
        style={{ width: '80%', maxWidth: '800px' }}
        modal
      >
        {loadingDetails ? (
          <div className={styles.loadingContainer}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            <p>Loading booking details...</p>
          </div>
        ) : bookingDetails ? (
          <div className={styles.bookingDetails}>
            <div className={styles.detailsSection}>
              <h3>Lab Information</h3>
              <p><strong>Lab Name:</strong> {typeof bookingDetails.labId === 'object' ? bookingDetails.labId.name : 'Unknown Lab'}</p>
              <p><strong>Lab ID:</strong> {typeof bookingDetails.labId === 'object' ? bookingDetails.labId._id : bookingDetails.labId || 'N/A'}</p>
              {typeof bookingDetails.labId === 'object' && (
                <>
                  <p><strong>Lab Phone:</strong> {bookingDetails.labId.phone || 'N/A'}</p>
                  <p><strong>Lab City:</strong> {bookingDetails.labId.city || 'N/A'}</p>
                </>
              )}
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Patient Information</h3>
              <p><strong>Name:</strong> {typeof bookingDetails.patientDetails === 'object' ? bookingDetails.patientDetails.name : 'N/A'}</p>
              <p><strong>Age:</strong> {typeof bookingDetails.patientDetails === 'object' ? bookingDetails.patientDetails.age : 'N/A'}</p>
              <p><strong>Phone:</strong> {typeof bookingDetails.patientDetails === 'object' ? bookingDetails.patientDetails.phone : 'N/A'}</p>
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Tests</h3>
              <table className={styles.testsTable}>
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails.testsRequested?.map((test, index) => (
                    <tr key={index}>
                      <td>{typeof test === 'object' ? test.name : 'Unknown Test'}</td>
                      <td>₹{typeof test === 'object' ? test.price : 0}</td>
                      <td>
                        <Tag 
                          value={typeof test === 'object' ? test.status : 'pending'} 
                          severity={getStatusSeverity(typeof test === 'object' ? test.status : 'pending')}
                        />
                      </td>
                      <td>
                        {test.status === 'completed' && test.testResultId && (
                          <Button 
                            label="View Result" 
                            icon="pi pi-file" 
                            onClick={() => viewTestResult(test.testResultId)}
                            className="p-button-text p-button-sm"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Collection Details</h3>
              <p>
                <strong>Collection Type:</strong> {bookingDetails.homeCollection?.required ? 'Home Collection' : 'Lab Visit'}
              </p>
              {bookingDetails.homeCollection?.required && (
                <>
                  <p><strong>Preferred Date:</strong> {bookingDetails.homeCollection?.preferredSlot?.date ? formatDate(bookingDetails.homeCollection.preferredSlot.date) : 'N/A'}</p>
                  <p><strong>Preferred Time:</strong> {bookingDetails.homeCollection?.preferredSlot?.time || 'N/A'}</p>
                  <p><strong>Status:</strong> {bookingDetails.homeCollection?.status || 'N/A'}</p>
                </>
              )}
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Payment Information</h3>
              <p><strong>Total Amount:</strong> ₹{typeof bookingDetails.payment === 'object' ? bookingDetails.payment.totalAmount : 0}</p>
              <p><strong>Paid Amount:</strong> ₹{typeof bookingDetails.payment === 'object' ? bookingDetails.payment.paidAmount : 0}</p>
              <p><strong>Pending Amount:</strong> ₹{typeof bookingDetails.payment === 'object' ? bookingDetails.payment.pendingAmount : 0}</p>
              <p>
                <strong>Payment Status:</strong> 
                <Tag 
                  value={typeof bookingDetails.payment === 'object' ? bookingDetails.payment.paymentStatus : 'pending'} 
                  severity={getStatusSeverity(typeof bookingDetails.payment === 'object' ? bookingDetails.payment.paymentStatus : 'pending')}
                />
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.errorContainer}>
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: 'var(--red-500)' }}></i>
            <p>Failed to load booking details</p>
          </div>
        )}
      </Dialog>
    );
  };

  const testResultDetailsDialog = () => {
    if (!selectedTestResult) return null;
    
    return (
      <Dialog 
        header="Test Result Details" 
        visible={showTestResultDetails} 
        onHide={() => setShowTestResultDetails(false)}
        style={{ width: '80%', maxWidth: '800px' }}
        modal
      >
        {loadingTestResult ? (
          <div className={styles.loadingContainer}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            <p>Loading test result details...</p>
          </div>
        ) : selectedTestResult ? (
          <div className={styles.testResultDetails}>
            <div className={styles.detailsSection}>
              <h3>Test Information</h3>
              <p><strong>Test Name:</strong> {selectedTestResult.testName || 'Unknown Test'}</p>
              <p><strong>Result ID:</strong> {selectedTestResult.resultId || 'N/A'}</p>
              <p><strong>Test Date:</strong> {selectedTestResult.testDate ? formatDate(selectedTestResult.testDate) : 'N/A'}</p>
              <p><strong>Status:</strong> {selectedTestResult.status || 'N/A'}</p>
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Patient Information</h3>
              <p><strong>Name:</strong> {selectedTestResult.patientDetails?.name || 'N/A'}</p>
              <p><strong>Age:</strong> {selectedTestResult.patientDetails?.age || 'N/A'}</p>
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Lab Information</h3>
              <p><strong>Lab Name:</strong> {selectedTestResult.labDetails?.name || 'Unknown Lab'}</p>
              <p><strong>Lab City:</strong> {selectedTestResult.labDetails?.city || 'N/A'}</p>
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Sample Information</h3>
              <p><strong>Sample ID:</strong> {selectedTestResult.sampleDetails?.sampleId || 'N/A'}</p>
              <p><strong>Sample Type:</strong> {selectedTestResult.sampleDetails?.sampleType || 'N/A'}</p>
              <p><strong>Collected At:</strong> {selectedTestResult.sampleDetails?.collectedAt ? formatDate(selectedTestResult.sampleDetails.collectedAt) : 'N/A'}</p>
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Test Results</h3>
              {selectedTestResult.results && selectedTestResult.results.length > 0 ? (
                <table className={styles.testsTable}>
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Value</th>
                      <th>Unit</th>
                      <th>Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTestResult.results.map((result, index) => (
                      <tr key={index}>
                        <td>{result.name || 'Unknown Parameter'}</td>
                        <td>{result.value || 'N/A'}</td>
                        <td>{result.unit || 'N/A'}</td>
                        <td>{result.required ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No test results available</p>
              )}
            </div>
            
            {selectedTestResult.verificationDetails && (
              <div className={styles.detailsSection}>
                <h3>Verification Details</h3>
                <p><strong>Verified By:</strong> {selectedTestResult.verificationDetails.verifiedBy || 'N/A'}</p>
                <p><strong>Verified At:</strong> {selectedTestResult.verificationDetails.verifiedAt ? formatDate(selectedTestResult.verificationDetails.verifiedAt) : 'N/A'}</p>
              </div>
            )}
            
            <div className={styles.detailsSection}>
              <h3>Report</h3>
              <Button 
                label="Download Report" 
                icon="pi pi-download" 
                onClick={() => window.open(`${apiUrl}/result/download?resultId=${selectedTestResult.resultId}`, '_blank')}
                className="p-button-outlined"
              />
            </div>
          </div>
        ) : (
          <div className={styles.errorContainer}>
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: 'var(--red-500)' }}></i>
            <p>Failed to load test result details</p>
          </div>
        )}
      </Dialog>
    );
  };

  const testResultsDialog = () => {
    return (
      <Dialog 
        header="Test Results" 
        visible={showTestResults} 
        onHide={() => setShowTestResults(false)}
        style={{ width: '90%', maxWidth: '1000px' }}
        modal
      >
        <div className={styles.filterSection}>
          <div className={styles.filterItem}>
            <label>From Date:</label>
            <Calendar 
              value={filters.fromDate} 
              onChange={(e) => handleFilterChange('fromDate', e.value)} 
              dateFormat="yy-mm-dd"
              placeholder="Select From Date"
            />
          </div>
          <div className={styles.filterItem}>
            <label>To Date:</label>
            <Calendar 
              value={filters.toDate} 
              onChange={(e) => handleFilterChange('toDate', e.value)} 
              dateFormat="yy-mm-dd"
              placeholder="Select To Date"
            />
          </div>
          <Button 
            label="Apply Filters" 
            icon="pi pi-filter" 
            onClick={() => fetchTestResults()}
          />
        </div>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            <p>Loading test results...</p>
          </div>
        ) : testResults.length > 0 ? (
          <>
            <DataView
              value={testResults}
              itemTemplate={testResultTemplate}
              paginator={false}
              emptyMessage="No test results found"
            />
            <Paginator 
              first={(filters.page - 1) * filters.limit} 
              rows={filters.limit} 
              totalRecords={totalRecords} 
              onPageChange={handlePageChange}
              rowsPerPageOptions={[5, 10, 20]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </>
        ) : (
          <div className={styles.noResults}>
            <p>No test results found for the selected criteria</p>
          </div>
        )}
      </Dialog>
    );
  };

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        labBookingApi.cancelBooking(bookingId),
        {},
        {
          headers: getAuthHeaders()
        }
      );
      
      if (response.data && !response.data.error) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Booking cancelled successfully',
          life: 3000
        });
        
        // Refresh the bookings list
        fetchBookings();
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.data.message || 'Failed to cancel booking',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const errorResult = handleApiError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorResult.message || 'Failed to cancel booking',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bookingListContainer}>
      <Toast ref={toast} />
      
      <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
        <TabPanel header="My Bookings">
          <div className={styles.bookingListHeader}>
            <h2>My Lab Bookings</h2>
            <div className={styles.headerActions}>
              <Button 
                label="View Test Results" 
                icon="pi pi-file" 
                onClick={viewTestResults}
                className="p-button-outlined"
              />
              <Button 
                label="Refresh" 
                icon="pi pi-refresh" 
                onClick={fetchBookings}
                loading={loading}
              />
            </div>
          </div>
          
          <div className={styles.filterSection}>
            <div className={styles.filterItem}>
              <label>Status:</label>
              <Dropdown 
                value={filters.status} 
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Confirmed', value: 'confirmed' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' }
                ]} 
                onChange={(e) => handleFilterChange('status', e.value)} 
                placeholder="Select Status"
              />
            </div>
            <div className={styles.filterItem}>
              <label>From Date:</label>
              <Calendar 
                value={filters.fromDate} 
                onChange={(e) => handleFilterChange('fromDate', e.value)} 
                dateFormat="yy-mm-dd"
                placeholder="Select From Date"
              />
            </div>
            <div className={styles.filterItem}>
              <label>To Date:</label>
              <Calendar 
                value={filters.toDate} 
                onChange={(e) => handleFilterChange('toDate', e.value)} 
                dateFormat="yy-mm-dd"
                placeholder="Select To Date"
              />
            </div>
            <Button 
              label="Apply Filters" 
              icon="pi pi-filter" 
              onClick={() => fetchBookings()}
            />
          </div>
          
          {bookings.length === 0 ? (
            <div className={styles.noBookings}>
              <p>You don't have any lab bookings yet.</p>
              <Button 
                label="Create New Booking" 
                icon="pi pi-plus" 
                onClick={() => setActiveTabIndex(1)}
              />
            </div>
          ) : (
            <>
              <DataView
                value={bookings}
                itemTemplate={itemTemplate}
                paginator={false}
                loading={loading}
                emptyMessage="No bookings found"
              />
              <Paginator 
                first={(filters.page - 1) * filters.limit} 
                rows={filters.limit} 
                totalRecords={totalRecords} 
                onPageChange={handlePageChange}
                rowsPerPageOptions={[5, 10, 20]}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              />
            </>
          )}
        </TabPanel>
        
        <TabPanel header="Create Booking">
          <div className={styles.createBookingRedirect}>
            <p>To create a new booking, please go to the lab services page.</p>
            <Button 
              label="Go to Lab Services" 
              icon="pi pi-arrow-right" 
              onClick={() => window.location.href = '/lab'}
            />
          </div>
        </TabPanel>
      </TabView>
      
      {bookingDetailsDialog()}
      {testResultsDialog()}
      {testResultDetailsDialog()}
    </div>
  );
};

export default BookingList; 
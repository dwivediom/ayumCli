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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedTestResult, setSelectedTestResult] = useState(null);
  const [showTestResultDetails, setShowTestResultDetails] = useState(false);
  const [loadingTestResult, setLoadingTestResult] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_B_PORT || 'http://localhost:5001';
  const apiUrl = `${baseUrl}/api/lab/user`;

  useEffect(() => {
    fetchBookings();
  }, [filters, pagination.page, pagination.limit]);

  const fetchBookings = async () => {
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
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.fromDate) queryParams.append('fromDate', formatDateForAPI(filters.fromDate));
      if (filters.toDate) queryParams.append('toDate', formatDateForAPI(filters.toDate));
      queryParams.append('page', pagination.page);
      queryParams.append('limit', pagination.limit);
      
      const response = await axios.get(`${apiUrl}/bookings/list?${queryParams.toString()}`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      
      if (response.data && !response.data.error) {
        setBookings(response.data.data || []);
        setPagination({
          page: response.data.pagination.page,
          limit: pagination.limit,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        });
      } else {
        setBookings([]);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch bookings',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch bookings',
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
      
      const response = await axios.get(`${apiUrl}/booking/details?bookingId=${bookingId}`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      
      if (response.data && !response.data.error) {
        setBookingDetails(response.data.data);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch booking details',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch booking details',
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
    setPagination(prev => ({
      ...prev,
      page: event.page + 1,
      limit: event.rows
    }));
  };

  const itemTemplate = (booking) => {
    // Calculate completed tests
    const totalTests = booking.testsRequested?.length || 0;
    const completedTests = booking.testsRequested?.filter(test => test.status === 'completed').length || 0;
    
    return (
      <div className={styles.bookingCard}>
        <div className={styles.bookingHeader}>
          <div className={styles.bookingInfo}>
            <h3>{booking.labId?.name || 'Lab Name'}</h3>
            <p className={styles.bookingId}>Booking ID: {booking._id}</p>
            <p className={styles.bookingDate}>Date: {formatDate(booking.createdAt)}</p>
            <p className={styles.patientName}>
              <i className="pi pi-user"></i> Patient: {booking.patientDetails?.name || 'N/A'}
            </p>
            <p className={styles.testCount}>
              <i className="pi pi-list"></i> Tests: {totalTests} ({completedTests} completed)
            </p>
          </div>
          <div className={styles.bookingStatus}>
            <Tag 
              value={booking.payment?.paymentStatus || 'pending'} 
              severity={getStatusSeverity(booking.payment?.paymentStatus)}
            />
          </div>
        </div>
        
        <div className={styles.bookingTests}>
          <h4>Tests:</h4>
          <ul>
            {booking.testsRequested?.map((test, index) => (
              <li key={index} className={styles.testItem}>
                <span className={styles.testName}>{test.name}</span>
                <span className={styles.testPrice}>₹{test.price}</span>
                {test.status === 'completed' && test.testResultId && (
                  <Button 
                    label="View Result" 
                    icon="pi pi-file" 
                    onClick={() => viewTestResult(test.testResultId)}
                    className="p-button-text p-button-sm"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.bookingFooter}>
          <div className={styles.bookingPrice}>
            <strong>Total Amount:</strong> ₹{booking.payment?.totalAmount || 0}
          </div>
          <div className={styles.bookingActions}>
            <Button 
              label="View Details" 
              icon="pi pi-eye" 
              onClick={() => viewBookingDetails(booking)}
              className="p-button-outlined"
            />
          </div>
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
        style={{ width: '90%', maxWidth: '1000px' }}
        modal
        className={styles.bookingDetailsDialog}
      >
        {loadingDetails ? (
          <div className={styles.loadingContainer}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            <p>Loading booking details...</p>
          </div>
        ) : bookingDetails ? (
          <div className={styles.bookingDetails}>
            {/* Top Section - Patient and Lab Info */}
            <div className={styles.detailsGrid}>
              {/* Patient Information Section */}
              <div className={`${styles.detailsSection} ${styles.patientSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-user" style={{ fontSize: '1.5rem', color: '#4CAF50' }}></i>
                  <h3>Patient Information</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Name:</td>
                        <td className={styles.value}>{bookingDetails.patientDetails?.name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Age:</td>
                        <td className={styles.value}>{bookingDetails.patientDetails?.age || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Phone:</td>
                        <td className={styles.value}>{bookingDetails.patientDetails?.phone || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab Information Section */}
              <div className={`${styles.detailsSection} ${styles.labSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-building" style={{ fontSize: '1.5rem', color: '#2196F3' }}></i>
                  <h3>Lab Information</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Lab Name:</td>
                        <td className={styles.value}>{bookingDetails.labId?.name || 'Unknown Lab'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Lab ID:</td>
                        <td className={styles.value}>{bookingDetails.labId?._id || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Phone:</td>
                        <td className={styles.value}>{bookingDetails.labId?.phone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>City:</td>
                        <td className={styles.value}>{bookingDetails.labId?.city || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tests Section */}
            <div className={`${styles.detailsSection} ${styles.testsSection}`}>
              <div className={styles.sectionHeader}>
                <i className="pi pi-list" style={{ fontSize: '1.5rem', color: '#E91E63' }}></i>
                <h3>Tests Requested</h3>
              </div>
              <div className={styles.sectionContent}>
                <table className={styles.testsTable}>
                  <thead>
                    <tr>
                      <th>Test Name</th>
                      <th>Price</th>
                      <th>Sample Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDetails.testsRequested?.map((test, index) => (
                      <tr key={index}>
                        <td>{test.name}</td>
                        <td>₹{test.price}</td>
                        <td>{test.sampleType}</td>
                        <td>
                          <Tag 
                            value={test.status} 
                            severity={getStatusSeverity(test.status)}
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
            </div>

            {/* Bottom Section - Collection and Payment Info */}
            <div className={styles.detailsGrid}>
              {/* Collection Details Section */}
              <div className={`${styles.detailsSection} ${styles.collectionSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-calendar" style={{ fontSize: '1.5rem', color: '#FF9800' }}></i>
                  <h3>Collection Details</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Collection Type:</td>
                        <td className={styles.value}>
                          {bookingDetails.homeCollection?.required ? 'Home Collection' : 'Lab Visit'}
                        </td>
                      </tr>
                      {bookingDetails.homeCollection?.required && (
                        <>
                          <tr>
                            <td className={styles.label}>Preferred Date:</td>
                            <td className={styles.value}>
                              {bookingDetails.homeCollection?.preferredSlot?.date 
                                ? formatDate(bookingDetails.homeCollection.preferredSlot.date) 
                                : 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.label}>Preferred Time:</td>
                            <td className={styles.value}>
                              {bookingDetails.homeCollection?.preferredSlot?.time || 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.label}>Status:</td>
                            <td className={styles.value}>
                              <Tag 
                                value={bookingDetails.homeCollection?.status || 'pending'} 
                                severity={getStatusSeverity(bookingDetails.homeCollection?.status)}
                              />
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Information Section */}
              <div className={`${styles.detailsSection} ${styles.paymentSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-money-bill" style={{ fontSize: '1.5rem', color: '#9C27B0' }}></i>
                  <h3>Payment Information</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Total Amount:</td>
                        <td className={styles.value}>₹{bookingDetails.payment?.totalAmount || 0}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Paid Amount:</td>
                        <td className={styles.value}>₹{bookingDetails.payment?.paidAmount || 0}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Pending Amount:</td>
                        <td className={styles.value}>₹{bookingDetails.payment?.pendingAmount || 0}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Payment Status:</td>
                        <td className={styles.value}>
                          <Tag 
                            value={bookingDetails.payment?.paymentStatus || 'pending'} 
                            severity={getStatusSeverity(bookingDetails.payment?.paymentStatus)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
        style={{ width: '90%', maxWidth: '1000px' }}
        modal
        className={styles.bookingDetailsDialog}
      >
        {loadingTestResult ? (
          <div className={styles.loadingContainer}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            <p>Loading test result details...</p>
          </div>
        ) : selectedTestResult ? (
          <div className={styles.bookingDetails}>
            {/* Top Section - Test Results */}
            <div className={`${styles.detailsSection} ${styles.testsSection}`}>
              <div className={styles.sectionHeader}>
                <i className="pi pi-list" style={{ fontSize: '1.5rem', color: '#E91E63' }}></i>
                <h3>Test Results</h3>
              </div>
              <div className={styles.sectionContent}>
                <table className={styles.testsTable}>
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Value</th>
                      <th>Unit</th>
                      <th>Reference Range</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTestResult.results?.map((result, index) => (
                      <tr key={index}>
                        <td>{result.name || 'Unknown Parameter'}</td>
                        <td>{result.value || 'N/A'}</td>
                        <td>{result.unit || 'N/A'}</td>
                        <td>{result.referenceRange || 'N/A'}</td>
                        <td>
                          <Tag 
                            value={result.status || 'normal'} 
                            severity={getStatusSeverity(result.status)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Middle Section - Test and Patient Info */}
            <div className={styles.detailsGrid}>
              {/* Test Information Section */}
              <div className={`${styles.detailsSection} ${styles.labSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-file" style={{ fontSize: '1.5rem', color: '#2196F3' }}></i>
                  <h3>Test Information</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Test Name:</td>
                        <td className={styles.value}>{selectedTestResult.testName || 'Unknown Test'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Result ID:</td>
                        <td className={styles.value}>{selectedTestResult.resultId || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Test Date:</td>
                        <td className={styles.value}>{selectedTestResult.testDate ? formatDate(selectedTestResult.testDate) : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Status:</td>
                        <td className={styles.value}>
                          <Tag 
                            value={selectedTestResult.status || 'pending'} 
                            severity={getStatusSeverity(selectedTestResult.status)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Patient Information Section */}
              <div className={`${styles.detailsSection} ${styles.patientSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-user" style={{ fontSize: '1.5rem', color: '#4CAF50' }}></i>
                  <h3>Patient Information</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Name:</td>
                        <td className={styles.value}>{selectedTestResult.patientDetails?.name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Age:</td>
                        <td className={styles.value}>{selectedTestResult.patientDetails?.age || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Gender:</td>
                        <td className={styles.value}>{selectedTestResult.patientDetails?.gender || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Section - Lab and Sample Info */}
            <div className={styles.detailsGrid}>
              {/* Lab Information Section */}
              <div className={`${styles.detailsSection} ${styles.labSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-building" style={{ fontSize: '1.5rem', color: '#2196F3' }}></i>
                  <h3>Lab Information</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Lab Name:</td>
                        <td className={styles.value}>{selectedTestResult.labDetails?.name || 'Unknown Lab'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Lab City:</td>
                        <td className={styles.value}>{selectedTestResult.labDetails?.city || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Phone:</td>
                        <td className={styles.value}>{selectedTestResult.labDetails?.phone || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Information Section */}
              <div className={`${styles.detailsSection} ${styles.collectionSection}`}>
                <div className={styles.sectionHeader}>
                  <i className="pi pi-calendar" style={{ fontSize: '1.5rem', color: '#FF9800' }}></i>
                  <h3>Sample Information</h3>
                </div>
                <div className={styles.sectionContent}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td className={styles.label}>Sample ID:</td>
                        <td className={styles.value}>{selectedTestResult.sampleDetails?.sampleId || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Sample Type:</td>
                        <td className={styles.value}>{selectedTestResult.sampleDetails?.sampleType || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className={styles.label}>Collected At:</td>
                        <td className={styles.value}>
                          {selectedTestResult.sampleDetails?.collectedAt 
                            ? formatDate(selectedTestResult.sampleDetails.collectedAt) 
                            : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Report Download Section */}
            <div className={styles.detailsSection}>
              <div className={styles.sectionHeader}>
                <i className="pi pi-download" style={{ fontSize: '1.5rem', color: '#9C27B0' }}></i>
                <h3>Report</h3>
              </div>
              <div className={styles.sectionContent}>
                <Button 
                  label="Download Report" 
                  icon="pi pi-download" 
                  onClick={() => window.open(`${apiUrl}/result/download?resultId=${selectedTestResult.resultId}`, '_blank')}
                  className="p-button-outlined"
                />
              </div>
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
              first={(pagination.page - 1) * pagination.limit} 
              rows={pagination.limit} 
              totalRecords={pagination.total} 
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
                first={(pagination.page - 1) * pagination.limit} 
                rows={pagination.limit} 
                totalRecords={pagination.total} 
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
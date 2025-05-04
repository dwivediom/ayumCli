import React, { useState, useEffect, useRef } from 'react';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import styles from './styles.module.css';
import { getAuthHeaders } from '../../config/api/labApi';

const MedicineRequests = () => {
  const toast = useRef(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
    startDate: null,
    endDate: null,
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString().split('T')[0]);
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString().split('T')[0]);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/list?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.data) {
        setRequests(response.data.requests);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch medicine requests',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const getStatusSeverity = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const requestTemplate = (request) => (
    <div className={styles.requestCard}>
      <div className={styles.requestHeader}>
        <div className={styles.requestInfo}>
          <h3>Order #{request.orderId}</h3>
          <Tag
            value={request.status}
            severity={getStatusSeverity(request.status)}
            className={styles.statusTag}
          />
        </div>
        <div className={styles.requestDate}>
          <i className="pi pi-calendar"></i>
          <span>{formatDate(request.createdAt)}</span>
        </div>
      </div>

      <div className={styles.requestContent}>
        <div className={styles.pharmacyInfo}>
          <h4>Pharmacy</h4>
          <p>{request.pharmacyId.name}</p>
          <p className={styles.hospital}>{request.pharmacyId.hospital}</p>
        </div>

        <div className={styles.deliveryInfo}>
          <h4>Delivery Address</h4>
          <p>{request.deliveryAddress.street}</p>
          <p>{request.deliveryAddress.city}, {request.deliveryAddress.state}</p>
          <p>Pincode: {request.deliveryAddress.pincode}</p>
          {request.deliveryAddress.landmark && (
            <p>Landmark: {request.deliveryAddress.landmark}</p>
          )}
        </div>

        <div className={styles.medicinesList}>
          <h4>Medicines ({request.items.length})</h4>
          <div className={styles.medicineItems}>
            {request.items.map((item, index) => (
              <div key={index} className={styles.medicineItem}>
                <span className={styles.medicineName}>{item.name}</span>
                <span className={styles.medicineQuantity}>Qty: {item.quantity}</span>
                {item.price && (
                  <span className={styles.medicinePrice}>₹{item.price}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.paymentInfo}>
          <h4>Payment Details</h4>
          <div className={styles.paymentStatus}>
            <span>Method: {request.payment.method}</span>
            <Tag
              value={request.payment.status}
              severity={getStatusSeverity(request.payment.status)}
            />
          </div>
          {request.payment.amount && (
            <div className={styles.paymentAmount}>
              <div className={styles.amountRow}>
                <span>Subtotal:</span>
                <span>₹{request.payment.amount.subtotal || 0}</span>
              </div>
              <div className={styles.amountRow}>
                <span>Tax:</span>
                <span>₹{request.payment.amount.tax || 0}</span>
              </div>
              <div className={styles.amountRow}>
                <span>Total:</span>
                <span>₹{request.payment.amount.total || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {request.notes && (
        <div className={styles.requestNotes}>
          <h4>Notes</h4>
          <p>{request.notes}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.medicineRequests}>
      <Toast ref={toast} />
      
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <label>Status</label>
          <Dropdown
            value={filters.status}
            options={statusOptions}
            onChange={(e) => setFilters({ ...filters, status: e.value })}
            placeholder="Select Status"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Start Date</label>
          <Calendar
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.value })}
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>End Date</label>
          <Calendar
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.value })}
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>
        
        <Button
          label="Reset Filters"
          icon="pi pi-refresh"
          className="p-button-text"
          onClick={() => setFilters({
            status: null,
            startDate: null,
            endDate: null,
            page: 1,
            limit: 10
          })}
        />
      </div>

      <DataView
        value={requests}
        itemTemplate={requestTemplate}
        paginator
        rows={10}
        totalRecords={pagination.total}
        loading={loading}
        className={styles.requestsDataView}
      />
    </div>
  );
};

export default MedicineRequests; 
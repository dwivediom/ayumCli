import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './styles.module.css';
import { getAuthHeaders } from '../../config/api/labApi';

const MedicineSelection = ({ pharmacyId, onMedicinesSelected }) => {
  const router = useRouter();
  const toast = useRef(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    notes: '',
    paymentMethod: 'cash'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const searchTimeout = useRef(null);

  const getMedicineTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'capsule':
        return 'pi pi-circle-fill';
      case 'tablet':
        return 'pi pi-stop';
      case 'injection':
        return 'pi pi-arrow-up-right';
      case 'syrup':
        return 'pi pi-bottle';
      default:
        return 'pi pi-question-circle';
    }
  };

  const getMedicineTypeLabel = (type) => {
    return type || '_';
  };

  const fetchMedicines = async (search = '') => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/pharmacy/medicines`,
        {
          params: {
            pharmacyId,
            searchTerm: search
          },
          headers: getAuthHeaders()
        }
      );
      
      if (response.data) {
        setMedicines(response.data.medicines || []);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        });
      } else {
        setMedicines([]);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch medicines',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setMedicines([]);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch medicines. Please try again.',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [pharmacyId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      fetchMedicines(value);
    }, 500);
  };

  const handleSearchButtonClick = () => {
    fetchMedicines(searchTerm);
  };

  const handleAddToCart = (medicine) => {
    const existingItem = cart.find(item => item.medicine._id === medicine._id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.medicine._id === medicine._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { medicine, quantity: 1 }]);
    }
    
    toast.current.show({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${medicine.brandName} added to cart`,
      life: 2000
    });
  };

  const handleRemoveFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicine._id !== medicineId));
  };

  const handleQuantityChange = (medicineId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(medicineId);
      return;
    }
    
    setCart(cart.map(item => 
      item.medicine._id === medicineId 
        ? { ...item, quantity }
        : item
    ));
  };

  const handleProceed = () => {
    setShowCheckoutDialog(true);
  };

  const handleCheckoutSubmit = async () => {
    try {
      const deliveryAddress = {
        street: checkoutForm.street,
        city: checkoutForm.city,
        state: checkoutForm.state,
        pincode: checkoutForm.pincode,
        landmark: checkoutForm.landmark
      };

      const items = cart.map(item => ({
        medicineId: item.medicine._id,
        quantity: item.quantity,
        name: item.medicine.brandName,
        price: item.medicine.price,
        total: item.medicine.price * item.quantity
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const deliveryCharge = 40;
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + deliveryCharge + tax;

      const requestData = {
        pharmacyId,
        orderType: 'medicine_search',
        contactNumber: checkoutForm.contactNumber,
        deliveryAddress,
        payment: {
          method: checkoutForm.paymentMethod,
          amount: {
            subtotal,
            discount: 0,
            deliveryCharge,
            tax,
            total
          }
        },
        items,
        notes: checkoutForm.notes
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/create`,
        requestData,
        { headers: getAuthHeaders() }
      );

      if (response.data) {
        toast.current.show({
          severity: 'success',
          summary: 'Order Created',
          detail: 'Your medicine request has been created successfully!',
          life: 3000
        });
        setShowCheckoutDialog(false);
        setTimeout(() => {
          router.push('/medical/requests');
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating medicine request:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create medicine request. Please try again.',
        life: 3000
      });
    }
  };

  const checkoutDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={() => setShowCheckoutDialog(false)} className="p-button-text" />
      <Button label="Submit" icon="pi pi-check" onClick={handleCheckoutSubmit} autoFocus />
    </div>
  );

  const paymentMethods = [
    { label: 'Cash on Delivery', value: 'cash' },
    { label: 'Online Payment', value: 'online' }
  ];

  const itemTemplate = (medicine) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDetails = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div className={styles.medicineCard}>
        <div className={styles.orderHeader}>
          <div className={styles.orderInfo}>
            <span className={styles.orderNumber}>Order #13</span>
            <span className={`${styles.orderStatus} ${styles.pending}`}>
              <i className="pi pi-clock"></i>
              Pending
            </span>
            <span className={styles.orderDate}>
              <i className="pi pi-calendar"></i>
              04 May 2025, 01:29 pm
            </span>
          </div>
        </div>

        <div className={styles.medicineList}>
          <div className={styles.medicineItem}>
            <div className={styles.medicineName}>Paracetamol 500mg</div>
            <div className={styles.medicineQuantity}>
              <span>Qty: 2</span>
              <span className={styles.medicinePrice}>₹100</span>
            </div>
          </div>
          <div className={styles.medicineItem}>
            <div className={styles.medicineName}>Azithromycin 250mg</div>
            <div className={styles.medicineQuantity}>
              <span>Qty: 1</span>
              <span className={styles.medicinePrice}>₹100</span>
            </div>
          </div>
        </div>

        <div className={styles.totalPrice}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalAmount}>₹355</span>
        </div>

        <button 
          className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
          onClick={toggleDetails}
        >
          <i className={`pi pi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          {isExpanded ? 'Hide Details' : 'View More Details'}
        </button>

        <div 
          className={`${styles.expandableDetails} ${isExpanded ? styles.expanded : ''}`}
          style={{ 
            maxHeight: isExpanded ? '1000px' : '0',
            opacity: isExpanded ? 1 : 0,
            visibility: isExpanded ? 'visible' : 'hidden'
          }}
        >
          <div className={styles.detailsContent}>
            <div className={styles.detailsSection}>
              <h4>Order Information</h4>
              <div className={styles.detailsList}>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Order ID</span>
                  <span className={styles.detailsValue}>#13</span>
                </div>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Order Date</span>
                  <span className={styles.detailsValue}>04 May 2025, 01:29 pm</span>
                </div>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Status</span>
                  <span className={styles.detailsValue}>Pending</span>
                </div>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h4>Payment Details</h4>
              <div className={styles.detailsList}>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Subtotal</span>
                  <span className={styles.detailsValue}>₹300</span>
                </div>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Tax (18%)</span>
                  <span className={styles.detailsValue}>₹54</span>
                </div>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Delivery Charge</span>
                  <span className={styles.detailsValue}>₹1</span>
                </div>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Total Amount</span>
                  <span className={styles.detailsValue}>₹355</span>
                </div>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h4>Delivery Information</h4>
              <div className={styles.detailsList}>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Delivery Address</span>
                  <span className={styles.detailsValue}>123, Main Street, City</span>
                </div>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Contact Number</span>
                  <span className={styles.detailsValue}>+91 9876543210</span>
                </div>
                <div className={styles.detailsListItem}>
                  <span className={styles.detailsLabel}>Expected Delivery</span>
                  <span className={styles.detailsValue}>05 May 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const cartItemTemplate = (item) => (
    <div key={item.medicine._id} className={styles.cartItem}>
      <div className={styles.cartItemContent}>
        <div className={styles.cartItemHeader}>
          <h4>{item.medicine.brandName || '_'}</h4>
          <span className={styles.cartItemPrice}>₹{item.medicine.price || '_'}</span>
        </div>
        <div className={styles.quantityControls}>
          <div className={styles.quantityInput}>
            <Button
              label="-"
              className="p-button-text"
              onClick={() => handleQuantityChange(item.medicine._id, item.quantity - 1)}
            />
            <InputNumber
              value={item.quantity}
              onValueChange={(e) => handleQuantityChange(item.medicine._id, e.value)}
              showButtons={false}
              min={1}
              max={100}
            />
            <Button
              label="+"
              className="p-button-text"
              onClick={() => handleQuantityChange(item.medicine._id, item.quantity + 1)}
            />
          </div>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => handleRemoveFromCart(item.medicine._id)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.medicineSelection}>
      <Toast ref={toast} />
      
      <div className={styles.searchSection}>
        <div className={styles.searchInput}>
          <InputText
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search medicines..."
            className="w-full"
          />
          <Button
            label="Search"
            icon="pi pi-search"
            onClick={handleSearchButtonClick}
          />
        </div>
      </div>

      <DataView
        value={medicines}
        itemTemplate={itemTemplate}
        paginator
        rows={10}
        totalRecords={pagination.total}
        loading={loading}
        className={styles.medicineDataView}
      />

      {cart.length > 0 && (
        <div className={styles.cartSummary}>
          <h3>Cart ({cart.length} items)</h3>
          <div className={styles.cartItems}>
            {cart.map(cartItemTemplate)}
          </div>
          <div className={styles.cartTotal}>
            <span>Total: ₹{cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0)}</span>
          </div>
          <Button
            label="Proceed to Checkout"
            icon="pi pi-shopping-bag"
            onClick={handleProceed}
            className="p-button-success"
          />
        </div>
      )}

      <Dialog
        header="Checkout Details"
        visible={showCheckoutDialog}
        style={{ width: '50vw' }}
        footer={checkoutDialogFooter}
        onHide={() => setShowCheckoutDialog(false)}
      >
        <div className={styles.checkoutForm}>
          <div className={styles.formSection}>
            <h3>Contact Information</h3>
            <div className={styles.formGroup}>
              <label htmlFor="contactNumber">Contact Number</label>
              <InputText
                id="contactNumber"
                value={checkoutForm.contactNumber}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, contactNumber: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Delivery Address</h3>
            <div className={styles.formGroup}>
              <label htmlFor="street">Street Address</label>
              <InputText
                id="street"
                value={checkoutForm.street}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, street: e.target.value })}
                placeholder="Enter street address"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              <InputText
                id="city"
                value={checkoutForm.city}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state">State</label>
              <InputText
                id="state"
                value={checkoutForm.state}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, state: e.target.value })}
                placeholder="Enter state"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="pincode">Pincode</label>
              <InputText
                id="pincode"
                value={checkoutForm.pincode}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                placeholder="Enter pincode"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="landmark">Landmark</label>
              <InputText
                id="landmark"
                value={checkoutForm.landmark}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, landmark: e.target.value })}
                placeholder="Enter landmark"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Payment Details</h3>
            <div className={styles.formGroup}>
              <label htmlFor="paymentMethod">Payment Method</label>
              <Dropdown
                id="paymentMethod"
                value={checkoutForm.paymentMethod}
                options={paymentMethods}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.value })}
                placeholder="Select payment method"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Additional Information</h3>
            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <InputText
                id="notes"
                value={checkoutForm.notes}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                placeholder="Any additional notes or instructions"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MedicineSelection; 
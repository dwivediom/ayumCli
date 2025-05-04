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
import { RadioButton } from 'primereact/radiobutton';
import PdfViewer from './PdfViewer';
import PrescriptionSelector from './PrescriptionSelector';

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
  const [selectionOption, setSelectionOption] = useState('search');
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    notes: '',
    paymentMethod: 'cash',
  });
  const prescriptionFileInputRef = useRef(null);
  const [enlargedFile, setEnlargedFile] = useState(null);
  const [showEnlargeDialog, setShowEnlargeDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callForm, setCallForm] = useState({
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    notes: '',
    paymentMethod: 'cash',
    preferredCallTime: '',
  });
  const [selectedCallPrescription, setSelectedCallPrescription] = useState(null);

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
    const cartItem = cart.find(item => item.medicine._id === medicine._id);
    const isInCart = !!cartItem;
    
    return (
      <div className={styles.medicineCard}>
        <div className={styles.medicineContent}>
          <div className={styles.medicineHeader}>
            <h3>{medicine.brandName || '_'}</h3>
            <Tag value={medicine.genericName || '_'} severity="info" />
          </div>
          
          <div className={styles.medicineDetails}>
            <div className={styles.detailItem}>
              <i className="pi pi-tag" style={{ color: '#2ecc71' }}></i>
              <span>₹{medicine.price || '_'}</span>
            </div>
            <div className={styles.detailItem}>
              <i className={getMedicineTypeIcon(medicine.type)} style={{ color: '#2ecc71' }}></i>
              <span>{getMedicineTypeLabel(medicine.type)}</span>
            </div>
          </div>
          
          <div className={styles.medicineActions}>
            {isInCart ? (
              <div className={styles.quantityControls}>
                <div className={styles.quantityInput}>
                  <Button
                    label="-"
                    className="p-button-text"
                    onClick={() => handleQuantityChange(medicine._id, cartItem.quantity - 1)}
                  />
                  <InputNumber
                    value={cartItem.quantity}
                    onValueChange={(e) => handleQuantityChange(medicine._id, e.value)}
                    showButtons={false}
                    min={1}
                    max={100}
                  />
                  <Button
                    label="+"
                    className="p-button-text"
                    onClick={() => handleQuantityChange(medicine._id, cartItem.quantity + 1)}
                  />
                </div>
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => handleRemoveFromCart(medicine._id)}
                />
              </div>
            ) : (
              <Button
                label="Add to Cart"
                icon="pi pi-shopping-cart"
                onClick={() => handleAddToCart(medicine)}
                className="p-button-success"
              />
            )}
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

  // Fetch prescriptions when dialog opens
  const fetchPrescriptions = async () => {
    setPrescriptionLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/media/files?fileType=prescription&page=1&limit=10`,
        { headers: getAuthHeaders() }
      );
      setPrescriptionFiles(response.data.data || []);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch prescriptions', life: 3000 });
      setPrescriptionFiles([]);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // Handle file upload
  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'prescription');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/media/upload`,
        formData,
        { headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data && response.data.url) {
        setPrescriptionFiles([response.data, ...prescriptionFiles]);
        setSelectedPrescription(response.data);
        toast.current?.show({ severity: 'success', summary: 'Uploaded', detail: 'Prescription uploaded', life: 2000 });
        fetchPrescriptions();
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Upload failed', life: 3000 });
    } finally {
      setUploading(false);
    }
  };

  // Handle prescription order submit
  const handlePrescriptionOrderSubmit = async () => {
    if (!selectedPrescription) return;
    try {
      const deliveryAddress = {
        street: prescriptionForm.street,
        city: prescriptionForm.city,
        state: prescriptionForm.state,
        pincode: prescriptionForm.pincode,
        landmark: prescriptionForm.landmark
      };
      const requestData = {
        pharmacyId,
        prescription: { url: selectedPrescription.url || selectedPrescription.fileUrl },
        orderType: 'prescription_upload',
        contactNumber: prescriptionForm.contactNumber,
        deliveryAddress,
        payment: { method: prescriptionForm.paymentMethod },
        notes: prescriptionForm.notes
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/create`,
        requestData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data) {
        toast.current?.show({ severity: 'success', summary: 'Order Created', detail: 'Your prescription order has been created!', life: 3000 });
        setShowPrescriptionDialog(false);
        setSelectedPrescription(null);
        setPrescriptionForm({
          contactNumber: '', street: '', city: '', state: '', pincode: '', landmark: '', notes: '', paymentMethod: 'cash',
        });
        setTimeout(() => router.push('/medical/requests'), 1000);
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create order', life: 3000 });
    }
  };

  // Open dialog when radio selected
  useEffect(() => {
    if (selectionOption === 'prescription') {
      setShowPrescriptionDialog(true);
      fetchPrescriptions();
    }
  }, [selectionOption]);

  // Dialog JSX
  const prescriptionDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={() => setShowPrescriptionDialog(false)} className="p-button-text" />
      <Button label="Submit" icon="pi pi-check" onClick={handlePrescriptionOrderSubmit} disabled={!selectedPrescription || !prescriptionForm.contactNumber || !prescriptionForm.street || !prescriptionForm.city || !prescriptionForm.state || !prescriptionForm.pincode} autoFocus />
    </div>
  );

  // Open call dialog when radio selected
  useEffect(() => {
    if (selectionOption === 'call') {
      setShowCallDialog(true);
    }
  }, [selectionOption]);

  const handleCallOrderSubmit = async () => {
    try {
      const deliveryAddress = {
        street: callForm.street,
        city: callForm.city,
        state: callForm.state,
        pincode: callForm.pincode,
        landmark: callForm.landmark
      };
      const requestData = {
        pharmacyId,
        orderType: 'call_required',
        contactNumber: callForm.contactNumber,
        deliveryAddress,
        payment: {
          method: callForm.paymentMethod,
          amount: {
            subtotal: 0.0,
            discount: 0.0,
            deliveryCharge: 0.0,
            tax: 0.0,
            total: 0.0
          }
        },
        prescription: selectedCallPrescription ? { url: selectedCallPrescription.url || selectedCallPrescription.fileUrl } : undefined,
        preferredCallTime: callForm.preferredCallTime,
        notes: callForm.notes
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/user/request/create`,
        requestData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data) {
        toast.current?.show({ severity: 'success', summary: 'Request Created', detail: 'Your call request has been created!', life: 3000 });
        setShowCallDialog(false);
        setSelectedCallPrescription(null);
        setCallForm({
          contactNumber: '', street: '', city: '', state: '', pincode: '', landmark: '', notes: '', paymentMethod: 'cash', preferredCallTime: '',
        });
        setTimeout(() => router.push('/medical/requests'), 1000);
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create call request', life: 3000 });
    }
  };

  return (
    <div className={styles.medicineSelection}>
      <Toast ref={toast} />
      
      {/* Medicine Selection Options */}
      <div className={styles.selectionOptions} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <RadioButton inputId="prescription" name="medicineOption" value="prescription" checked={selectionOption === 'prescription'} onChange={e => setSelectionOption(e.value)} />
          <label htmlFor="prescription" style={{ marginLeft: 8, fontWeight: 500 }}>Order everything as per prescription</label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <RadioButton inputId="search" name="medicineOption" value="search" checked={selectionOption === 'search'} onChange={e => setSelectionOption(e.value)} />
          <label htmlFor="search" style={{ marginLeft: 8, fontWeight: 500 }}>Search and add medicines to cart</label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <RadioButton inputId="call" name="medicineOption" value="call" checked={selectionOption === 'call'} onChange={e => setSelectionOption(e.value)} />
          <label htmlFor="call" style={{ marginLeft: 8, fontWeight: 500, color: '#e57373' }}>Call me for details</label>
          {selectionOption === 'call' && (
            <div style={{ color: '#e57373', marginLeft: 32, fontSize: 14 }}>
              A 1mg pharmacist will call you from 011-41183088 within 30 mins to confirm medicines (8 am - 8 pm)
            </div>
          )}
        </div>
      </div>

      {/* Show only for 'search' option */}
      {selectionOption === 'search' && (
        <>
          {/* New Component 1 Placeholder */}
          {/* <div className="customCard">
            <strong>New Component 1</strong> (replace with actual component)
          </div>
          {/* New Component 2 Placeholder */}
          {/* <div className="customCard">
            <strong>New Component 2</strong> (replace with actual component)
          </div> */} 

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
        </>
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

      <Dialog
        header="Order via Prescription"
        visible={showPrescriptionDialog}
        style={{ width: '60vw', maxWidth: 700 }}
        footer={prescriptionDialogFooter}
        onHide={() => setShowPrescriptionDialog(false)}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3>Choose Prescription</h3>
            {prescriptionLoading ? (
              <div>Loading...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 220, overflowY: 'auto' }}>
                {prescriptionFiles.length === 0 && <div>No prescriptions found.</div>}
                {prescriptionFiles.map((file, idx) => (
                  <div
                    key={file._id || file.fileUrl || idx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      border: selectedPrescription?.fileUrl === file.fileUrl ? '2px solid #6190e8' : '1px solid #e3e8ee',
                      borderRadius: 8, padding: 6, background: selectedPrescription?.fileUrl === file.fileUrl ? '#eaf1fb' : '#fff',
                      minHeight: 48, position: 'relative'
                    }}
                    onClick={() => setSelectedPrescription(file)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {file.fileFormat && file.fileFormat.startsWith('image') ? (
                        <img src={file.fileUrl} alt={file.fileName} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 4, border: '1px solid #e3e8ee' }} />
                      ) : (
                        <i className="pi pi-file-pdf" style={{ fontSize: 24, color: '#e57373' }}></i>
                      )}
                    </div>
                    <span style={{ flex: 1, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.fileName || file.fileUrl?.split('/').pop()}</span>
                    <Button
                      icon="pi pi-external-link"
                      className="p-button-text p-button-sm"
                      style={{ marginLeft: 4, zIndex: 2 }}
                      onClick={e => { e.stopPropagation(); setEnlargedFile(file); setShowEnlargeDialog(true); }}
                      tooltip="Enlarge"
                      tooltipOptions={{ position: 'top' }}
                    />
                    {selectedPrescription?.fileUrl === file.fileUrl && <i className="pi pi-check-circle" style={{ color: '#6190e8', fontSize: 16 }}></i>}
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <input
                type="file"
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                ref={prescriptionFileInputRef}
                onChange={handlePrescriptionUpload}
                disabled={uploading}
              />
              <Button
                label={uploading ? 'Uploading...' : 'Upload New'}
                icon="pi pi-upload"
                className="p-button-sm"
                disabled={uploading}
                onClick={() => prescriptionFileInputRef.current && prescriptionFileInputRef.current.click()}
              />
            </div>
          </div>
          <div style={{ flex: 2, minWidth: 300 }}>
            <h3>Order Details</h3>
            <div className={styles.checkoutForm}>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-contactNumber">Contact Number</label>
                  <InputText id="presc-contactNumber" value={prescriptionForm.contactNumber} onChange={e => setPrescriptionForm({ ...prescriptionForm, contactNumber: e.target.value })} placeholder="Enter contact number" />
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-street">Street Address</label>
                  <InputText id="presc-street" value={prescriptionForm.street} onChange={e => setPrescriptionForm({ ...prescriptionForm, street: e.target.value })} placeholder="Enter street address" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-city">City</label>
                  <InputText id="presc-city" value={prescriptionForm.city} onChange={e => setPrescriptionForm({ ...prescriptionForm, city: e.target.value })} placeholder="Enter city" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-state">State</label>
                  <InputText id="presc-state" value={prescriptionForm.state} onChange={e => setPrescriptionForm({ ...prescriptionForm, state: e.target.value })} placeholder="Enter state" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-pincode">Pincode</label>
                  <InputText id="presc-pincode" value={prescriptionForm.pincode} onChange={e => setPrescriptionForm({ ...prescriptionForm, pincode: e.target.value })} placeholder="Enter pincode" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-landmark">Landmark</label>
                  <InputText id="presc-landmark" value={prescriptionForm.landmark} onChange={e => setPrescriptionForm({ ...prescriptionForm, landmark: e.target.value })} placeholder="Enter landmark" />
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-paymentMethod">Payment Method</label>
                  <Dropdown id="presc-paymentMethod" value={prescriptionForm.paymentMethod} options={paymentMethods} onChange={e => setPrescriptionForm({ ...prescriptionForm, paymentMethod: e.value })} placeholder="Select payment method" />
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="presc-notes">Notes</label>
                  <InputText id="presc-notes" value={prescriptionForm.notes} onChange={e => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })} placeholder="Any additional notes or instructions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Enlarge Dialog */}
      <Dialog
        header={enlargedFile ? (enlargedFile.fileName || 'Preview') : 'Preview'}
        visible={showEnlargeDialog}
        style={{ width: '90vw', maxWidth: 900 }}
        onHide={() => setShowEnlargeDialog(false)}
        modal
      >
        {enlargedFile && (
          enlargedFile.fileFormat && enlargedFile.fileFormat.startsWith('image') ? (
            <img src={enlargedFile.fileUrl} alt={enlargedFile.fileName} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8 }} />
          ) : (
            <PdfViewer url={enlargedFile.fileUrl} />
          )
        )}
      </Dialog>

      <Dialog
        header="Call Me For Details"
        visible={showCallDialog}
        style={{ width: '60vw', maxWidth: 700 }}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => {
              setShowCallDialog(false);
              setSelectedCallPrescription(null);
            }} className="p-button-text" />
            <Button label="Submit" icon="pi pi-check" onClick={handleCallOrderSubmit} disabled={!callForm.contactNumber || !callForm.street || !callForm.city || !callForm.state || !callForm.pincode} autoFocus />
          </div>
        }
        onHide={() => {
          setShowCallDialog(false);
          setSelectedCallPrescription(null);
        }}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3>Prescription</h3>
            <PrescriptionSelector
              value={selectedCallPrescription}
              onChange={setSelectedCallPrescription}
              getAuthHeaders={getAuthHeaders}
            />
          </div>
          <div style={{ flex: 2, minWidth: 300 }}>
            <h3>Call Request Details</h3>
            <div className={styles.checkoutForm}>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="call-contactNumber">Contact Number</label>
                  <InputText id="call-contactNumber" value={callForm.contactNumber} onChange={e => setCallForm({ ...callForm, contactNumber: e.target.value })} placeholder="Enter contact number" />
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="call-street">Street Address</label>
                  <InputText id="call-street" value={callForm.street} onChange={e => setCallForm({ ...callForm, street: e.target.value })} placeholder="Enter street address" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="call-city">City</label>
                  <InputText id="call-city" value={callForm.city} onChange={e => setCallForm({ ...callForm, city: e.target.value })} placeholder="Enter city" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="call-state">State</label>
                  <InputText id="call-state" value={callForm.state} onChange={e => setCallForm({ ...callForm, state: e.target.value })} placeholder="Enter state" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="call-pincode">Pincode</label>
                  <InputText id="call-pincode" value={callForm.pincode} onChange={e => setCallForm({ ...callForm, pincode: e.target.value })} placeholder="Enter pincode" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="call-landmark">Landmark</label>
                  <InputText id="call-landmark" value={callForm.landmark} onChange={e => setCallForm({ ...callForm, landmark: e.target.value })} placeholder="Enter landmark" />
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="call-paymentMethod">Payment Method</label>
                  <Dropdown id="call-paymentMethod" value={callForm.paymentMethod} options={paymentMethods} onChange={e => setCallForm({ ...callForm, paymentMethod: e.value })} placeholder="Select payment method" />
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="call-preferredCallTime">Preferred Call Time</label>
                  <InputText id="call-preferredCallTime" value={callForm.preferredCallTime} onChange={e => setCallForm({ ...callForm, preferredCallTime: e.target.value })} placeholder="Enter preferred call time (e.g. 2025-04-27T10:00:00Z)" />
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="call-notes">Notes</label>
                  <InputText id="call-notes" value={callForm.notes} onChange={e => setCallForm({ ...callForm, notes: e.target.value })} placeholder="Any additional notes or instructions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MedicineSelection; 
import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import BookingList from '../../components/LabBooking/BookingList';
import styles from '../../components/LabBooking/styles.module.css';

const LabBookingsPage = () => {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (e) => {
    setActiveTabIndex(e.index);
    
    // If user clicks on "Create Booking" tab, redirect to lab page
    if (e.index === 1) {
      router.push('/lab');
    }
  };

  return (
    <div className={styles.bookingListContainer}>
      <div className={styles.pageHeader}>
        <h1>Lab Bookings</h1>
        <Button 
          label="Create New Booking" 
          icon="pi pi-plus" 
          onClick={() => router.push('/lab')}
          className="p-button-primary"
        />
      </div>
      
      <TabView activeIndex={activeTabIndex} onTabChange={handleTabChange}>
        <TabPanel header="My Bookings">
          <BookingList />
        </TabPanel>
        
        <TabPanel header="Create Booking">
          <div className={styles.createBookingRedirect}>
            <p>To create a new booking, please go to the lab services page.</p>
            <Button 
              label="Go to Lab Services" 
              icon="pi pi-arrow-right" 
              onClick={() => router.push('/lab')}
              className="p-button-primary"
            />
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default LabBookingsPage; 
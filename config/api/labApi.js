/**
 * Lab API Configuration
 * 
 * This file contains all the API endpoints used in the lab and lab booking components.
 * It centralizes the API configuration to make it easier to manage and update.
 */

// Base URL for the API
const baseUrl = process.env.NEXT_PUBLIC_B_PORT || 'http://localhost:5001';

// API endpoints for lab tests
export const labTestApi = {
  // Get all test categories
  getTestCategories: () => `${baseUrl}/api/lab/user/tests/categories`,
  
  // Get all offered tests with optional filters
  getAllOfferedTests: (params) => `${baseUrl}/api/lab/user/tests/all-offered`,
  
  // Check test availability
  checkTestAvailability: () => `${baseUrl}/api/lab/user/tests/check-availability`,
};

// API endpoints for lab booking
export const labBookingApi = {
  // Create a new booking
  createBooking: () => `${baseUrl}/api/lab/user/booking/create`,
  
  // Get user bookings
  getUserBookings: () => `${baseUrl}/api/lab/user/bookings`,
  
  // Get booking details
  getBookingDetails: (bookingId) => `${baseUrl}/api/lab/user/bookings/${bookingId}`,
  
  // Cancel booking
  cancelBooking: (bookingId) => `${baseUrl}/api/lab/user/bookings/${bookingId}/cancel`,
};

// API endpoints for lab management
export const labManagementApi = {
  // Get lab details
  getLabDetails: (labId) => `${baseUrl}/api/lab/user/labs/${labId}`,
  
  // Get lab reviews
  getLabReviews: (labId) => `${baseUrl}/api/lab/user/labs/${labId}/reviews`,
  
  // Get lab availability
  getLabAvailability: (labId) => `${baseUrl}/api/lab/user/labs/${labId}/availability`,
};

// Helper function to get headers with authentication token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('usertoken');
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token
  };
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error data:', error.response.data);
    console.error('Error status:', error.response.status);
    console.error('Error headers:', error.response.headers);
    
    return {
      error: true,
      message: error.response.data.message || 'An error occurred with the server',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Error request:', error.request);
    
    return {
      error: true,
      message: 'No response received from the server',
      status: 0
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
    
    return {
      error: true,
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
}; 
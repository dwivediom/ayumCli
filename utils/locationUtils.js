/**
 * Utility functions for handling location permissions and geocoding
 */

/**
 * Request location permission from the user
 * @returns {Promise<Object>} Object containing success status and location data or error
 */
export const requestLocationPermission = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ success: false, error: 'Geolocation is not supported by your browser' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission was denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }
        
        reject({ success: false, error: errorMessage });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

/**
 * Get address from coordinates using reverse geocoding
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Object containing success status and address data or error
 */
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch address data');
    }
    
    const data = await response.json();
    
    return {
      success: true,
      address: {
        displayName: data.display_name,
        street: data.address?.road || '',
        houseNumber: data.address?.house_number || '',
        suburb: data.address?.suburb || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        country: data.address?.country || '',
        postalCode: data.address?.postcode || '',
        formattedAddress: data.display_name
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get address from coordinates'
    };
  }
};

/**
 * Get current location and address
 * @returns {Promise<Object>} Object containing success status and location/address data or error
 */
export const getCurrentLocationAndAddress = async () => {
  try {
    // First request location permission
    const locationResult = await requestLocationPermission();
    
    if (!locationResult.success) {
      return locationResult;
    }
    
    // Then get address from coordinates
    const addressResult = await getAddressFromCoordinates(
      locationResult.location.latitude,
      locationResult.location.longitude
    );
    
    if (!addressResult.success) {
      return addressResult;
    }
    
    return {
      success: true,
      location: locationResult.location,
      address: addressResult.address
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get location and address'
    };
  }
};

/**
 * Save precise location data to localStorage
 * @param {Object} locationData - Object containing latitude and longitude
 * @param {string} [key='savedLocation'] - Key to use for storing in localStorage
 * @returns {Object} Object containing success status and message
 */
export const savePreciseLocation = (locationData, key = 'savedLocation') => {
  try {
    if (!locationData || !locationData.latitude || !locationData.longitude) {
      return {
        success: false,
        error: 'Invalid location data provided'
      };
    }
    
    // Save to localStorage with timestamp
    const locationWithTimestamp = {
      ...locationData,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(key, JSON.stringify(locationWithTimestamp));
    
    return {
      success: true,
      message: 'Location saved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to save location'
    };
  }
};

/**
 * Get saved precise location from localStorage
 * @param {string} [key='savedLocation'] - Key used for storing in localStorage
 * @returns {Object} Object containing success status and location data or error
 */
export const getSavedPreciseLocation = (key = 'savedLocation') => {
  try {
    const savedLocation = localStorage.getItem(key);
    
    if (!savedLocation) {
      return {
        success: false,
        error: 'No saved location found'
      };
    }
    
    const locationData = JSON.parse(savedLocation);
    
    return {
      success: true,
      location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timestamp: locationData.timestamp
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to retrieve saved location'
    };
  }
}; 
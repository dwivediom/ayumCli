// utils/useDeviceId.js

import { v4 as uuidv4 } from 'uuid';


/**
 * Custom hook to ensure a device ID is stored in localStorage.
 * - If userEmail is provided, use it as the device ID.
 * - Otherwise, if a device ID does not already exist, generate one.
 *
 * @param {string|null} userEmail - The user's email (if logged in), or null/undefined if not.
 */
function useDeviceId(userEmail) {

    if (typeof window === 'undefined') return; // ensure client-side

    let deviceId = localStorage.getItem('deviceId');

    if (userEmail) {
      // If the user is logged in, use their email as the device ID.
      deviceId = userEmail;
      localStorage.setItem('deviceId', deviceId);
      console.log("Device ID set from user email:", deviceId);
    } else {
      // If no device ID exists, generate a new one.
      if (!deviceId) {
        deviceId = uuidv4();;
        localStorage.setItem('deviceId', deviceId);
        console.log("Generated new device ID:", deviceId);
      } else {
        console.log("Existing device ID found:", deviceId);
      }
    }

}

export default useDeviceId;

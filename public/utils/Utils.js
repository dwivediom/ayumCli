export const setCookie = async (name, value, days) => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + expirationDate.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};
export const formatDate = (dateString) => {
  dateString = dateString.slice(0, 10);
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};
export const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) {
    return 0; // If there are no reviews, the average rating is 0
  }

  // Calculate the sum of all ratings
  // const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  let totalRating = 0;
  for (let i = 0; i < reviews.length; i++) {
    totalRating += parseInt(reviews[i]?.rating);
  }

  // Calculate the average rating
  const averageRating = parseInt(totalRating) / reviews.length;

  // Round the average rating to one decimal place
  // return averageRating;
  return Math.round(averageRating * 10) / 10;
};

export const getCookie = async (name) => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

export const cityoptions = [
  { label: "Rewa" },
  { label: "Satna" },
  { label: "Sidhi" },
  { label: "Jabalpur" },
  { label: "Nagpur" },
  { label: "Gwalior" },
];

export function convertTo12HourFormat(time) {
  const [hour, minute] = time.split(":").map(Number); // Split and convert to numbers
  const isPM = hour >= 12; // Check if it's PM
  const adjustedHour = hour % 12 || 12; // Convert hour to 12-hour format (0 becomes 12)
  const period = isPM ? "PM" : "AM"; // Determine AM/PM
  return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export const getTodayDay = (date) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date(date);
  return daysOfWeek[today.getDay()];
};

export const isBeforeToday = (inputDate) => {
  // Get today's date without the time (start of the day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compare the input date
  return inputDate < today;
};

export const convertDateToDDMMMYYYY = (isoString) => {
  // Array of month abbreviations
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Convert the ISO string to a Date object
  const date = new Date(isoString);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
  const month = months[date.getMonth()]; // Get the month abbreviation
  const year = date.getFullYear(); // Get the year

  // Return the date in DD MMM YYYY format
  return `${day} ${month} ${year}`;
};
export const convertToReadableDateTime = (isoString) => {
  // Create a Date object from the ISO string
  const date = new Date(isoString);

  // Extract date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Combine components into readable format
  const readableDate = `${day}-${month}-${year}`;
  const readableTime = `${hours}:${minutes}`;

  return `Date: ${readableDate}, Time: ${readableTime}`;
};

// utils/auth.js
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    console.log(payload, payload.exp * 1000 < Date.now(), "expireval");
    return payload.exp * 1000 < Date.now(); // Compare expiration time
  } catch (error) {
    return true; // If error in decoding, assume expired
  }
};

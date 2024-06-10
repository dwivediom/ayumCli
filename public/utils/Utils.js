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

  console.log(totalRating, "andtotal", reviews.length);

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

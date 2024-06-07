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

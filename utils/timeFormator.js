export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp); // convert timestamp to Date object
  date.setUTCHours(date.getUTCHours()); // add 5 hours for Indian Standard Time
  date.setUTCMinutes(date.getUTCMinutes()); // add 30 minutes for Indian Standard Time
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const amOrPm = hours >= 12 ? "PM" : "AM"; // set AM or PM based on hours value
  hours = hours % 12 || 12; // convert hours to 12-hour format
  minutes = minutes < 10 ? `0${minutes}` : minutes; // add leading zero to minutes if necessary
  if (!month || !year) {
    return "now";
  }
  return `${hours}:${minutes} ${amOrPm}, ${day} ${month} ${year}`;
};

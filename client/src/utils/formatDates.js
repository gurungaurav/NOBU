export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const formatCurrentDates = (date) => {
  const dateObj = new Date(date);
  const options = { month: "short", day: "numeric", year: "numeric" };
  const formatted_date = new Intl.DateTimeFormat("en-US", options).format(
    dateObj
  );
  return formatted_date;
};

export const calculateNights = (check_in, check_out) => {
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
  const nightCount = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return nightCount;
};

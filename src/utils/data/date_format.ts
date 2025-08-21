export const formatMonthLabel = (isoDate: string): string => {
  const [year, month] = isoDate.split("-");
  const monthNames = [
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

  return `${monthNames[parseInt(month, 10) - 1]}-${year.slice(-2)}`;
};

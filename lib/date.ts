const DAY_IN_MS = 24 * 60 * 60 * 1000;

const weekdayFormatter = new Intl.DateTimeFormat("es-ES", { weekday: "long" });
const monthDayFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short"
});
const timeFormatter = new Intl.DateTimeFormat("es-ES", {
  hour: "numeric",
  minute: "2-digit"
});

const toStartOfDay = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const formatMonthDay = (date: Date) =>
  monthDayFormatter
    .format(date)
    .toLowerCase()
    .replace(".", "");

export const formatTransactionDate = (dateString: string, now = new Date()) => {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString;
  }

  const todayStart = toStartOfDay(now);
  const dateStart = toStartOfDay(parsedDate);
  const diffInDays = Math.floor((todayStart.getTime() - dateStart.getTime()) / DAY_IN_MS);

  let label = formatMonthDay(parsedDate);

  if (isSameDay(parsedDate, now)) {
    label = "Hoy";
  } else if (isSameDay(parsedDate, new Date(todayStart.getTime() - DAY_IN_MS))) {
    label = "Ayer";
  } else if (diffInDays >= 2 && diffInDays < 7) {
    label = weekdayFormatter.format(parsedDate).toLowerCase();
  }

  const time = timeFormatter.format(parsedDate);
  return `${label} a las ${time}`;
};

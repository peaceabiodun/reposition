export const truncateString = (str: string, numWords: number) => {
  if (!str) return str;
  const words = str.split(' ');
  if (words?.length <= numWords) {
    return str;
  }
  if (numWords > words?.length) {
    return words?.slice(0, words?.length).join(' ') + '...';
  }
  if (numWords <= words.length) {
    return words?.slice(0, numWords).join(' ') + '...';
  }
};

export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};

const MONTHS_OF_YEAR = [
  'Janaury',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const isDateValid = (date: string): boolean => {
  const dateValue = new Date(date);
  return !isNaN(dateValue.getTime());
};

export const getDate = (date: string): number | null | string => {
  const dateValue = new Date(date);
  const value = dateValue.getDate();
  const ordinalValue = getOrdinal(value);
  return isDateValid(date) ? ordinalValue : null;
};

export const getMonth = (date: string): string | null => {
  const dateValue = new Date(date);
  return isDateValid(date) ? MONTHS_OF_YEAR[dateValue.getMonth() ?? 0] : null;
};
export const getShortMonth = (date: string): string | null => {
  const month = getMonth(date);
  return month ? month.slice(0, 3) : null;
};

export const getYear = (date: string): number | null => {
  const dateValue = new Date(date);
  return isDateValid(date) ? dateValue.getFullYear() : null;
};

export const getSimpleDateFormat = (date: string): string | null => {
  return `${getDate(date)} ${getShortMonth(date)}, ${getYear(date)}`;
};

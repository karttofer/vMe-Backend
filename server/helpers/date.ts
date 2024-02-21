/**
 * @param date Date before to be sent to the database
 * @returns void
 */
export const toHumnaTime = (date: Date) => {
  return date.toLocaleString();
};

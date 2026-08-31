export const calculateLateFee = (daysOverdue: number): number => {
  return daysOverdue * 2;
};

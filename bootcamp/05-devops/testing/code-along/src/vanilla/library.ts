export const calculateLateFee = (daysOverdue: number): number => {
  return Math.min(daysOverdue * 2, 10);
};

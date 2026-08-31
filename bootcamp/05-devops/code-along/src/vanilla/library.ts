export const calculateLateFee = (daysOverdue: number): number => {
  const fee = daysOverdue * 2;
  if (fee > 10) {
    return 10;
  }
  return fee;
};

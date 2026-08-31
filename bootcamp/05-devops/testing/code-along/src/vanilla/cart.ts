export const calculateDiscount = (
  price: number,
  percentage: number,
): number => {
  if (price < 0 || percentage < 0) {
    throw new Error('Values cannot be negative');
  }

  return price - price * (percentage / 100);
};

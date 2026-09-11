export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

export const isAuctionOpen = (endDate: Date): boolean => {
  return endDate > new Date();
};

import type { UserSummary } from "./user";

export interface Offer {
  id: string;
  amount: number;
  bidder: UserSummary;
  createdAt: string;
}

export interface MyOfferAuctionSummary {
  id: string;
  title: string;
  endDate: string;
}

export interface MyOffer {
  id: string;
  amount: number;
  createdAt: string;
  isWinning: boolean;
  auction: MyOfferAuctionSummary;
}

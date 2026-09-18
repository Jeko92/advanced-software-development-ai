import type { UserSummary } from "./user";

export type AuctionStatus = "open" | "closed";
export type AuctionSort = "ending-soon" | "ending-late";

export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  endDate: string;
  status: AuctionStatus;
  seller: UserSummary;
  createdAt: string;
}

export interface AuctionQueryParams {
  page?: number;
  limit?: number;
  status?: AuctionStatus;
  minPrice?: number;
  maxPrice?: number;
  sort?: AuctionSort;
  sellerId?: string;
}

export interface AuctionListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuctionListResponse {
  data: Auction[];
  meta: AuctionListMeta;
}

export interface CreateAuctionInput {
  title: string;
  description: string;
  startingPrice: number;
  endDate?: string;
}

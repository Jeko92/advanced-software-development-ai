/**
 * Derived, never stored. An auction is `open` while its `endDate` is still in
 * the future and `closed` from that moment on.
 */
export enum AuctionStatus {
  Open = 'open',
  Closed = 'closed',
}

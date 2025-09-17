
export interface MachineCounterUpdateEvent {
  resource?: string;
  productChangeRequired: boolean;
  toolChangeRequired: boolean;
  rmChangeRequired: boolean;
  orderList: Order[];
  nextOrderList: Order[];
  txnDateGmt?: string;
  msgId?: string;
}

export interface Order {
  orderName?: string;
  operation?: string;
  product?: string;
  qty?: string;
  spq?: string;
  accumulativeGoodCount?: string;
  accumulativeScrapCount?: string;
  processTime?: string;
  collectRemainingMinutes?: string;
  completeRemainingMinutes?: string;
  accumulativeScrapList: Scrap[];
}

export interface Scrap {
  scrapReason?: string;
  scrapQty?: string;
}

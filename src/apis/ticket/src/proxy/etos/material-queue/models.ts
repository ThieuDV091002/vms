
export interface MaterialQueueChangeEvent {
  resource?: string;
  operation?: string;
  txnDateGmt?: string;
  type?: string;
  mfgOrder?: string;
  materialQueue?: string;
  mqDetails: MqDetail[];
}

export interface MqDetail {
  batch?: string;
  container?: string;
  product?: string;
  qty?: string;
  uOM?: string;
}

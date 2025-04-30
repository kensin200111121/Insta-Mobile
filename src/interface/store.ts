export interface StoreInfo {
  _id: string;
  name: string;
  storeId: string;
  storeInfo: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  },
  bankInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    bankName: string;
    routingNumber: string;
    accountNumber: string;
  };
  isAutoBatchTime: boolean;
  cryptoType: string;
  tipMode: 'percentage' | 'fixed';
  tipAmounts: number[];
  percentageFeeMode: boolean;
  percentageFeeAmount: number;
  fixedFeeMode: boolean;
  fixedFeeAmount: number;
  percentageProcessingFeeMode: boolean;
  percentageProcessingFeeAmount: number;
  fixedProcessingFeeMode: boolean;
  fixedProcessingFeeAmount: number;
  noConvenienceFee: boolean;
  noTip: boolean;
  mtd_volume?: string;
  avg_daily_volume?: string;
  avg_ticket?: number;
  db?: string;
  cr?: string;
  visa?: string;
  mc?: string;
  discover?: string;
  amex?: string;
  of_terminals?: string;
  notes?: string;
  merchant?: {
    mid?: string;
    descriptor?: string;  
  }
}
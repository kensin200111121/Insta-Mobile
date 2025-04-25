import { UserInfo } from "../user";
import { StoreInfo } from "../store";

export interface RefundItem {
  _id: string;
  created_at: Date;
  refunded_at: Date;
  transaction_id: string;
  customer_name: string;
  phone: string;
  amount: number;
  refund: number;
  store: StoreInfo;
  user: UserInfo;
};

export interface RefundCreateRequest {
  transaction_id: string;
  amount: number;
}
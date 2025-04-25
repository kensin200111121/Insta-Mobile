import type { TransactionLogResponse, TransactionRequest } from '../interface/transaction';

import { request } from './request';

export const createTransaction = (data: TransactionRequest) => request<TransactionLogResponse>('post', '/transaction/create', data);


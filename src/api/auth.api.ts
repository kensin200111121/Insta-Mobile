import type { AuthRequest, AuthResponse, LogSaveRequest, LogSaveResponse, VerifyPinRequest } from '../interface/auth';

import { request } from './request';

export const signIn = (data: AuthRequest) => request<AuthResponse>('post', '/auth/store', data);
export const verifyPin = (data: VerifyPinRequest) => request<AuthResponse>('post', '/auth/user', data);

export const saveLog = (data: LogSaveRequest) => request<LogSaveResponse>('post', '/auth/log', data);


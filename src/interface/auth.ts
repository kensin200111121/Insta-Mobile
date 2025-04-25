import { StoreInfo } from "./store"

export type AuthRequest = {
    storeId: string,
}

export type AuthResponse = {
    token: string,
    user: Object,
    store: StoreInfo
}

export type VerifyPinRequest = {
    pin: string;
}

export type LogSaveRequest = {
    data: string;
}

export type LogSaveResponse = {
    data: string;
}
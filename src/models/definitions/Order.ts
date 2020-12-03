/* eslint-disable camelcase */
import { ObjectID } from "../types";

export interface Order {
    id: ObjectID;
    create_time: Date;
    ip: string;
    amount: number;
    member_id: ObjectID;
    status: OrderStatus;
    payment_time: Date | null;
    error_msg: string | null;
}

export type OrderStatus = "UNPAID" | "SUCCESS" | "INVALID";

export function buildOrder(data: Order) {
    data.create_time = new Date(+data.create_time);
    if (data.payment_time) data.payment_time = new Date(+data.payment_time);
    return data;
}

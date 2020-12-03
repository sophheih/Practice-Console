import { Address, Service } from ".";
import { ObjectID } from "../types";


/* eslint-disable camelcase */
export interface Reservation {
    id: ObjectID;
    therapist_id: ObjectID;
    member_id: ObjectID;
    total_price: number;
    start_time: Date;
    end_time: Date;
    buffer_start: number;
    buffer_end: number;
    services_id: Service[];
    address: Address;
}

export function buildReservation(data: Reservation) {
    data.start_time = new Date(+data.start_time);
    data.end_time = new Date(+data.end_time);
    return data;
}

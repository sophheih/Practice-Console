/* eslint-disable camelcase */

import { ObjectID } from "../types";

export interface Address {
    id: ObjectID;
    city: string;
    district: string;
    detail: string;
    member_id: ObjectID;
    note: string;
}

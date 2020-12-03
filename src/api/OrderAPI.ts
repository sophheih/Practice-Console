/* eslint-disable no-invalid-this */

import { AuthedFetchFunction } from "../hooks/useAPIs";
import { buildOrder, Order } from "../models/definitions";
import { ErrorResponse, ObjectID } from "../models/types";

export default class OrderAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

    getData = (id: ObjectID) => {
        return new Promise<Order>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/order/" + id, "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Order;
                        resolve(buildOrder(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    getAll = () => {
        return new Promise<Order[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/order/", "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Order[];
                        resdata = resdata.map((resd) => buildOrder(resd));
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };
}

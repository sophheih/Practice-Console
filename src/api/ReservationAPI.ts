/* eslint-disable camelcase */
/* eslint-disable no-invalid-this */

import { AuthedFetchFunction } from "../hooks/useAPIs";
import { buildReservation, Reservation, Service } from "../models/definitions";
import { ErrorResponse, getAllReservationsParams } from "../models/types";

export default class ReservationAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

    getData = (reservationID: string) => {
        let ok = false;
        let resdata;
        return new Promise<Reservation>((resolve, reject) => {
            this.authedFetch("/reservation/" + reservationID, "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Reservation;
                        resolve(buildReservation(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    getAll = (options: getAllReservationsParams) => {
        let queryParams = "?";
        if (options.date) queryParams += "date=" + options.date;
        if (options.therapist) queryParams += "therapist=" + options.therapist;
        if (options.skip) queryParams += "skip=" + options.skip;
        if (options.limit) queryParams += "limit=" + options.limit;

        let ok = false;
        let resdata;
        return new Promise<Reservation[]>((resolve, reject) => {
            this.authedFetch("/reservation/" + queryParams, "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Reservation[];
                        resolve(resdata.map((r) => buildReservation(r)));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    update = (reservation: Reservation) => {
        return new Promise<Reservation>((resolve, reject) => {
            const requestBody: any = reservation;
            requestBody.start_time = Math.round(reservation.start_time.getTime() / 1000);
            requestBody.end_time = Math.round(reservation.end_time.getTime() / 1000);
            requestBody.services_id = requestBody.services_id.map((s: Service) => s.id);
            requestBody.address = requestBody.address.id;
            let ok = false;
            let resdata;
            this.authedFetch("/reservation/" + reservation.id, "PUT", JSON.stringify(reservation))
                .then((res) => {
                    ok = res.status === 202;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Reservation;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    create = (data: Reservation) => {
        return new Promise<Reservation>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/reservation/", "POST", JSON.stringify(data))
                .then((res) => {
                    ok = res.status === 201;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Reservation;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(new Error(resdata.message));
                    }
                })
                .catch((err) => reject(err));
        });
    };

    delete = (reservationID: string) => {
        return new Promise((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/reservation/" + reservationID, "DELETE")
                .then((res) => {
                    ok = res.status === 201;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resolve();
                    } else {
                        resdata = res as ErrorResponse;
                        reject(new Error(resdata.message));
                    }
                })
                .catch((err) => reject(err));
        });
    };
}

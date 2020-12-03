/* eslint-disable no-invalid-this */

import { AuthedFetchFunction } from "../hooks/useAPIs";
import { buildEvent, Event, getEventFormData } from "../models/definitions";
import { ErrorResponse } from "../models/types";

export default class EventAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

    get = (memberID: string) => {
        return new Promise<Event>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/event/" + memberID, "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Event;
                        resolve(buildEvent(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    getAll = () => {
        return new Promise<Event[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/event/", "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Event[];
                        resolve(resdata.map((e) => buildEvent(e)));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    create = (data: Event) => {
        return new Promise<Event>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/event/", "POST", getEventFormData(data))
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Event;
                        resolve(buildEvent(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    update = (data: Event) => {
        return new Promise<Event>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/event/" + data.id, "PUT", getEventFormData(data))
                .then((res) => {
                    if (res.status === 201) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Event;
                        resolve(buildEvent(data));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    delete = (data: Event) => {
        return new Promise<void>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch(`/event/${data.id}`, "DELETE")
                .then((res) => {
                    if (res.status === 202) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resolve();
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                });
        });
    };
}

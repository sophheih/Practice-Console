/* eslint-disable no-invalid-this */

import { AuthedFetchFunction } from "../hooks/useAPIs";
import { getServiceFormData, Service } from "../models/definitions";
import { ErrorResponse } from "../models/types";

export default class ServiceAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

    getData = (serviceID: string) => {
        return new Promise<Service>((resolve, reject) => {
            this.authedFetch("/service/" + serviceID, "GET")
                .then((res) => {
                    if (res.status === 200) return res.json();
                    else reject(res.statusText);
                })
                .then((res: Service) => {
                    resolve(res);
                })
                .catch((err) => reject(err));
        });
    };

    getAll = () => {
        return new Promise<Service[]>((resolve, reject) => {
            this.authedFetch("/service/", "GET")
                .then((res) => {
                    if (res.status === 200) return res.json();
                    else reject(res.statusText);
                })
                .then((res: Service[]) => {
                    resolve(res);
                })
                .catch((err) => reject(err));
        });
    };

    create = (data: Service) => {
        return new Promise<Service>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/service/", "POST", getServiceFormData(data))
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Service;
                        resolve(res);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    update = (data: Service) => {
        return new Promise<Service>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/service/" + data.id, "PUT", getServiceFormData(data))
                .then((res) => {
                    if (res.status === 201) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Service;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    delete = (data: Service) => {
        return new Promise<void>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch(`/service/${data.id}`, "DELETE")
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

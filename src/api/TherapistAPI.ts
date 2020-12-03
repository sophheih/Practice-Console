/* eslint-disable no-invalid-this */

import { AuthedFetchFunction } from "../hooks/useAPIs";
import { getTherapistFormData, Therapist } from "../models/definitions";
import { ErrorResponse } from "../models/types";

export default class TherapistAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

    getData = (id: string) => {
        return new Promise<Therapist>((resolve, reject) => {
            this.authedFetch("/therapist/" + id, "GET")
                .then((res) => {
                    if (res.status === 200) return res.json();
                    else reject(res.statusText);
                })
                .then((res: Therapist) => {
                    resolve(res);
                })
                .catch((err) => reject(err));
        });
    };

    getAll = () => {
        return new Promise<Therapist[]>((resolve, reject) => {
            this.authedFetch("/therapist/", "GET")
                .then((res) => {
                    if (res.status === 200) return res.json();
                    else reject(res.statusText);
                })
                .then((res: Therapist[]) => {
                    resolve(res);
                })
                .catch((err) => reject(err));
        });
    };

    create = (data: Therapist) => {
        return new Promise<Therapist>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/therapist/", "POST", getTherapistFormData(data))
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Therapist;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    update = (data: Therapist) => {
        return new Promise<Therapist>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/therapist/" + data.id, "PUT", getTherapistFormData(data))
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Therapist;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                });
        });
    };

    delete = (data: Therapist) => {
        return new Promise<void>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch(`/therapist/${data.id}`, "DELETE")
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

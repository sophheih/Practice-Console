/* eslint-disable no-invalid-this */

import { AuthedFetchFunction } from "../hooks/useAPIs";
import { Address, buildMember, Member } from "../models/definitions";
import { ErrorResponse } from "../models/types";

export default class MemberAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

    getData = (memberID: string) => {
        let ok = false;
        let resdata;
        return new Promise<Member>((resolve, reject) => {
            this.authedFetch("/member/" + memberID, "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Member;
                        resolve(buildMember(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    getAll = () => {
        let ok = false;
        let resdata;
        return new Promise<Member[]>((resolve, reject) => {
            this.authedFetch("/member/", "GET")
                .then((res) => {
                    if (res.status === 200) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Member[];
                        resolve(resdata.map((member) => buildMember(member)));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    getAddresses = (memberID: string) => {
        return new Promise<Address[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch("/member/address/?memberid=" + memberID, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Address[];
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    create = (member: Member) => {
        return new Promise<Member>((resolve, reject) => {
            let requestBody: any = member;
            requestBody.birthday = member.birthday.getTime() / 1000;
            requestBody = JSON.stringify(requestBody);
            let resdata;
            let ok = false;

            this.authedFetch("/member/register", "POST", requestBody)
                .then((res) => {
                    if (res.status === 201) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resolve(buildMember(res));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    update = (member: Member) => {
        return new Promise<Member>((resolve, reject) => {
            let requestBody: any = member;
            requestBody.birthday = member.birthday.getTime() / 1000;
            requestBody = JSON.stringify(requestBody);

            let ok = false;
            let resdata;
            this.authedFetch("/member/" + member.id, "PUT", requestBody)
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Member;
                        resolve(buildMember(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    delete = (data: Member) => {
        return new Promise<void>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch(`/member/${data.id}`, "DELETE")
                .then((res) => {
                    if (res.status === 200) ok = true;
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

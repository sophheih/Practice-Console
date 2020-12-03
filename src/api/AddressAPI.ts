import { AuthedFetchFunction } from "../hooks/useAPIs";
import { Address } from "../models/definitions";
import { ErrorResponse } from "../models/types";

export default class AddressAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

     get = (addressID: string) => {
         return new Promise<Address>((resolve, reject) => {
             let ok = false;
             let resdata;
             this.authedFetch("/member/address/" + addressID, "GET")
                 .then((res) => {
                     ok = res.ok;
                     return res.json();
                 })
                 .then((res) => {
                     if (ok) {
                         resdata = res as Address;
                         resolve(resdata);
                     } else {
                         resdata = res as ErrorResponse;
                         reject(resdata.message);
                     }
                 });
         });
     };
}

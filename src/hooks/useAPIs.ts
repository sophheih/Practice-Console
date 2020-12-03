import AddressAPI from "../api/AddressAPI";
import EventAPI from "../api/EventAPI";
import ImageAPI from "../api/ImageAPI";
import MemberAPI from "../api/MemberAPI";
import OrderAPI from "../api/OrderAPI";
import ReservationAPI from "../api/ReservationAPI";
import ServiceAPI from "../api/ServiceAPI";
import TherapistAPI from "../api/TherapistAPI";
import { API_URL } from "../config";
import { HttpMethod } from "../models/types";
import { useToken } from "./useToken";

export interface APIs {
    event: EventAPI,
    member: MemberAPI,
    address: AddressAPI,
    reservation: ReservationAPI,
    order: OrderAPI,
    service: ServiceAPI,
    therapist: TherapistAPI,
    image: ImageAPI,
}

// eslint-disable-next-line no-unused-vars
export type AuthedFetchFunction = (url: string, method: HttpMethod, body?: string | FormData | undefined) => Promise<Response>;

export const useAPIs = (): APIs => {
    const { token } = useToken();

    const authedFetch : AuthedFetchFunction = (url: string, method: HttpMethod, body?: string | FormData) => {
        return fetch(API_URL + url, {
            method: method,
            body: body,
            headers: new Headers({
                Authorization: "Token " + token,
            }),
        });
    };

    return {
        event: new EventAPI(authedFetch),
        member: new MemberAPI(authedFetch),
        address: new AddressAPI(authedFetch),
        reservation: new ReservationAPI(authedFetch),
        order: new OrderAPI(authedFetch),
        service: new ServiceAPI(authedFetch),
        therapist: new TherapistAPI(authedFetch),
        image: new ImageAPI(authedFetch),
    };
};

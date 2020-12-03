type ObjectID = string;

type UnixTimestamp = number;

export interface getAllReservationsParams {
    date?: UnixTimestamp;
    therapist?: ObjectID;
    skip?: number;
    limit?: number;
}

export interface ErrorResponse {
    message: string;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

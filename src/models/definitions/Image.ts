/* eslint-disable camelcase */
export interface Image {
    id: string;
    url: string;
    usage: number;
    upload_time: Date;
}

export function buildImage(data: Image) {
    data.upload_time = new Date(data.upload_time);
    return data;
}

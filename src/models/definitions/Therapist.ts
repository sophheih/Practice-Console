/* eslint-disable camelcase */
import { ObjectID } from "../types";

export interface Therapist {
    id: ObjectID;
    name: string;
    image_url: string;
    gender: "男" | "女" | "其他";
    description: string;
}

export const defaultTherapist : Therapist = { id: "", name: "", gender: "男", description: "", image_url: "" };

export function getTherapistFormData(data: Therapist) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image_url", data.image_url);
    formData.append("gender", data.gender);
    formData.append("description", data.description);
    return formData;
}

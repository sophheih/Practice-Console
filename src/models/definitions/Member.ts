/* eslint-disable camelcase */
import { ObjectID } from "../types";

export interface Member {
    id: ObjectID;
    username: string;
    real_name: string;
    balance: number;
    gender: "男" | "女" | "其他";
    cellphone: string;
    email: string;
    vip: boolean;
    birthday: Date;
    password: string;
}

export const defaultMember : Member = {
    id: "",
    real_name: "",
    username: "",
    balance: 0,
    gender: "男",
    cellphone: "",
    password: "",
    email: "",
    vip: false,
    birthday: new Date(),
};

export function buildMember(data: Member) {
    data.birthday = new Date(+data.birthday);
    return data;
}

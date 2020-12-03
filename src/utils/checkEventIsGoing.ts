import { Event } from "../models/definitions";

export default function checkEventIsGoing(event: Event) {
    if (event.begin_date>= new Date()) return "未開始";
    if (event.end_date<= new Date()) return "已結束";
    return "進行中";
}

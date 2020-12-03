import { OrderStatus } from "../models/definitions";

export default function getOrderStatusString(status: OrderStatus) {
    switch (status) {
    case "SUCCESS":
        return "付款完成";
    case "UNPAID":
        return "尚未付款";
    case "INVALID":
        return "無效訂單";
    default:
        return "發生錯誤";
    }
}

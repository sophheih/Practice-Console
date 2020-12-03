import dateToString from "./dateToString";
import timeToString from "./timeToString";

export default function dateToFullString(date: Date) {
    return dateToString(date, true) + " " + timeToString(date, false);
}

export default function timeToString(time: Date, numberOnly?: boolean) {
    if (numberOnly === undefined || numberOnly) {
        return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
    } else return time.getHours() + "點" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + "分";
}

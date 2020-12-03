export function getDuration(start: Date, end: Date, resultFormat?: "Day" | "Hour" | "Minute" | "Second" | "Millisecond") {
    switch (resultFormat) {
    case "Day":
        return Math.round((end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24);
    case "Hour":
        return Math.round((end.getTime() - start.getTime()) / 1000 / 60 / 60);
    case "Minute":
        return Math.round((end.getTime() - start.getTime()) / 1000 / 60);
    case "Second":
        return Math.round((end.getTime() - start.getTime()) / 1000);
    case "Millisecond":
        return end.getTime() - start.getTime();
    default:
        return Math.round((end.getTime() - start.getTime()) / 1000 / 60);
    }
}

const dateToString = (date: Date | undefined, displayYear?: boolean) => {
    if (date !== undefined) {
        return (displayYear ? date.getFullYear() + "年" : "") + (date.getMonth() + 1) + "月" + date.getDate() + "日";
    } else {
        return "";
    }
};

export default dateToString;

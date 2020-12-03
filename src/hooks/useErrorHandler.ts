import { useHistory } from "react-router-dom";
import { Notification } from "rsuite";
import { useToken } from "./useToken";

export const useErrorHandler = () => {
    const token = useToken();
    const history = useHistory();

    const handleError = (err: any, title: string, defaultDescription: string) => {
        let description = defaultDescription;

        switch (err) {
        case "Unauthorized":
            Notification.error({
                title: "授權失敗",
                description: "您的授權代碼已經失效，請重新登入",
                placement: "bottomStart",
            });
            history.push("/no-token");
            token.resetToken();
            return;
        case "Invalid token":
            Notification.error({
                title: "授權失敗",
                description: "您的授權代碼已經失效，請重新登入",
                placement: "bottomStart",
            });
            history.push("/no-token");
            token.resetToken();
            return;
        default:
            if (err !== undefined) description = err.toString();
            Notification.error({
                title: title,
                description: description,
                placement: "bottomStart",
            });
        }
    };

    return { handleError };
};

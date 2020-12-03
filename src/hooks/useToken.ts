import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export interface TokenContext {
    token: string | undefined,
    // eslint-disable-next-line no-unused-vars
    setCurrentToken: (currentToken: string) => void
    resetToken: () => void;
}

export const useToken = (): TokenContext => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [token, setToken] = useState(cookies.token);

    const setCurrentToken = (currentToken: string) => {
        setCookie("token", currentToken);
    };

    const resetToken = () => {
        removeCookie("token");
    };

    useEffect(() => {
        setToken(cookies.token);
    }, [cookies.token]);

    return { token, setCurrentToken, resetToken };
};

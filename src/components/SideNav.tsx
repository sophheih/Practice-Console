import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon, IconProps } from "rsuite";
import ListItem from "rsuite/lib/List/ListItem";
import iconImage from "../assets/icon.png";
import { useToken } from "../hooks/useToken";
import "../styles/Sidenav.sass";

interface ListItem {
    key: string;
    text: string;
    onClick: () => void;
    icon: IconProps["icon"];
}

const SideNav = () => {
    const [width, setWidth] = useState<number | undefined>(300);

    const history = useHistory();
    const { resetToken } = useToken();

    const updateDimensions = () => {
        setWidth(undefined);
    };

    const listItems: ListItem[] = [
        { key: "", text: "總覽", onClick: () => history.push("/"), icon: "pie-chart" },
        { key: "reservation", text: "預約排程管理", onClick: () => history.push("/reservation"), icon: "calendar" },
        { key: "member", text: "會員管理", onClick: () => history.push("/member"), icon: "user" },
        { key: "service", text: "服務項目管理", onClick: () => history.push("/service"), icon: "hand-lizard-o" },
        { key: "event", text: "促銷活動管理", onClick: () => history.push("/event"), icon: "sales" },
        { key: "therapist", text: "按摩師傅管理", onClick: () => history.push("/therapist"), icon: "male" },
        { key: "order", text: "儲值訂單管理", onClick: () => history.push("/order"), icon: "order-form" },
        { key: "logout", text: "登出", onClick: () => resetToken(), icon: "sign-out" },
    ];

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        updateDimensions();
    }, []);

    const current = history.location.pathname.split("/")[1];

    return (
        <div
            ref={(ref) => {
                if (ref && width === undefined) setWidth(ref.clientWidth);
            }}
        >
            <div className="sidenav" style={{ width: width }}>
                <img src={iconImage} alt="logo" width={width} />
                {listItems.map((item) => (
                    <div className={current === item.key ? "sidenav-item active" : "sidenav-item"} key={item.key} onClick={item.onClick}>
                        <Icon icon={item.icon} />
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideNav;

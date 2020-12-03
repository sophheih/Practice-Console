import React, { useEffect, useState } from "react";
import iconImage from "../assets/icon.png";
import "../styles/ScreenWidthWarning.sass";

const ScreenWidthWarning = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setScreenWidth(window.innerWidth);
        });
    }, []);

    if (screenWidth <= 1270) {
        return (
            <div className="screen-width-warning">
                <img alt="Logo" src={iconImage} />
                <p>魔松勁管理後台需要足夠的視窗寬度才能正常顯示</p>
                <p>請調整目前的瀏覽器視窗寬度</p>
            </div>
        );
    } else {
        return <></>;
    }
};

export default ScreenWidthWarning;

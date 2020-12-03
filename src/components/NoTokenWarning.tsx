import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, FlexboxGrid, Input, Notification } from "rsuite";
import iconImage from "../assets/icon.png";
import { useToken } from "../hooks/useToken";
import "../styles/NoTokenWarning.sass";

const NoTokenWarning = () => {
    const { token, setCurrentToken } = useToken();
    const history = useHistory();

    const [inputingToken, setInputingToken] = useState("");

    const updateToken = () => {
        if (inputingToken.split(".").length !== 3) {
            Notification.warning({
                title: "請輸入正確的 Access Token",
                description: "您輸入的 Access Token 無效。若您忘記您的存取金鑰，請聯繫技術人員處理。",
                placement: "bottomStart",
            });
            return;
        }

        setCurrentToken(inputingToken);
        history.push("/");
    };

    if (token === undefined) {
        return (
            <div className="no-token-warning">
                <img alt="Logo" src={iconImage} />
                <p>請輸入授權代碼 (Access Token)</p>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item>
                        <Input
                            style={{ width: 240, marginTop: 18 }}
                            value={inputingToken}
                            onChange={(v) => setInputingToken(v)}
                            // eslint-disable-next-line max-len
                            placeholder="eyJIUzIOiJKV10eiJQiLCXAihbGciOJ1NiJ9.eyJle5NjEwjc2MzgyNDgsImlhdCI6MjI0OCwiZGF0YSI6eHAiOjE2MMTUyJ1c2VybmFtZWluIiwiYWRtaW4iOnRydWV9SI6ImFkbfQ.sPe-jJxzJnTKPBE1MtJH81kboRaTEFwjE_Lt3bA1HY4"
                        />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <Button style={{ marginTop: 18 }} appearance="primary" onClick={updateToken}>
                    驗證身分
                </Button>
            </div>
        );
    } else {
        return <></>;
    }
};

export default NoTokenWarning;

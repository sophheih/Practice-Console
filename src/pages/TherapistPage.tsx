import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Icon, IconButton, Input, Notification, Row, Table } from "rsuite";
import TherapistCreateDrawer from "../components/Drawer/TherapistDrawer/TherapistCreateDrawer";
import TherapistDetailDrawer from "../components/Drawer/TherapistDrawer/TherapistDetailDrawer";
import { useAPIs } from "../hooks/useAPIs";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { Therapist } from "../models/definitions";

const { Column, HeaderCell, Cell } = Table;

interface RouteParams {
    therapistID: string;
}

const TherapistPage = () => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const { therapistID } = useParams<RouteParams>();

    const [therapists, setTherapists] = useState<Therapist[] | undefined>(undefined);
    const [therapist, setTherapist] = useState<Therapist | undefined>();
    const [keyword, setKeyword] = useState("");
    const [isCreatingTherapist, setCreatingTherapist] = useState(false);

    useEffect(() => {
        refresh();
        if (therapistID && therapistID.length === 24) {
            Notification.info({
                title: "請稍候",
                description: "正在下載按摩師 " + therapistID + " 的資料 ...",
                placement: "bottomStart",
                key: "getTherapistData",
            });
            APIs.therapist
                .getData(therapistID)
                .then((res) => {
                    setTherapist(res);
                })
                .catch((err) => {
                    handleError(err, "發生錯誤", "下載按摩師 " + therapistID + " 資料時發生問題，請檢查主機連線狀態或聯繫技術人員");
                });
        } else {
            history.push("/therapist");
            setTherapist(undefined);
        }
    }, [history.location.pathname]);

    const filltedData = (keyword: string) => {
        if (keyword !== "") {
            return therapists?.filter((therapist) => {
                if (therapist.name.includes(keyword)) return true;
                if (therapist.id === keyword) return true;
            });
        } else return therapists;
    };

    const refresh = () => {
        APIs.therapist
            .getAll()
            .then((res) => setTherapists(res))
            .catch((err) => handleError(err, "發生錯誤", "下載所有按摩師的資料時發生問題，請檢查主機連線狀態或聯繫技術人員"));
    };

    return (
        <div className="page-container">
            <Row style={{ margin: "32px 0" }}>
                <h1>按摩師管理</h1>
                <p>點擊按摩師可以編輯資料</p>
            </Row>

            <Row style={{ marginTop: 18 }}>
                <IconButton onClick={() => setCreatingTherapist(true)} icon={<Icon icon="plus" />} placement="right" appearance="primary">
                    加入新按摩師
                </IconButton>
            </Row>

            <Row style={{ marginTop: 36 }}>
                <Input placeholder="使用關鍵字搜尋" value={keyword} onChange={(v) => setKeyword(v)} />
            </Row>

            <Row style={{ marginTop: 36 }}>
                <Table
                    width={960}
                    rowHeight={64}
                    autoHeight
                    data={filltedData(keyword)}
                    onRowClick={(therapist) => {
                        history.push("/therapist/" + therapist.id);
                    }}
                    loading={therapists === undefined}
                >
                    <Column width={80}>
                        <HeaderCell>照片</HeaderCell>
                        <Cell>
                            {(rowData: Therapist) => <img src={rowData.image_url} style={{ width: 40, borderRadius: 40 }} alt="avatar" />}
                        </Cell>
                    </Column>

                    <Column width={160} fixed>
                        <HeaderCell>姓名</HeaderCell>
                        <Cell dataKey="name" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>性別</HeaderCell>
                        <Cell dataKey="gender" />
                    </Column>

                    <Column width={270}>
                        <HeaderCell>介紹</HeaderCell>
                        <Cell dataKey="description" />
                    </Column>
                </Table>
            </Row>

            <TherapistDetailDrawer
                therapist={therapist}
                onDelete={() => {
                    refresh();
                }}
                close={() => {
                    history.push("/therapist");
                }}
            />
            <TherapistCreateDrawer
                isShowing={isCreatingTherapist}
                onCreated={() => {
                    setCreatingTherapist(false);
                    refresh();
                }}
                onClose={() => setCreatingTherapist(false)}
            ></TherapistCreateDrawer>
        </div>
    );
};

export default TherapistPage;

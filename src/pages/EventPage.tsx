import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Icon, IconButton, Input, Notification, Row, Table } from "rsuite";
import EventCreateDrawer from "../components/Drawer/EventDrawer/EventCreateDrawer";
import EventDetailDrawer from "../components/Drawer/EventDrawer/EventDetailDrawer";
import { useAPIs } from "../hooks/useAPIs";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { Event } from "../models/definitions";
import checkEventIsGoing from "../utils/checkEventIsGoing";
import dateToFullString from "../utils/dateToFullString";

const { Column, HeaderCell, Cell } = Table;

interface RouteParams {
    eventID: string;
}

const EventPage = () => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const { eventID } = useParams<RouteParams>();

    const [events, setEvents] = useState<Event[] | undefined>(undefined);
    const [event, setEvent] = useState<Event | undefined>();
    const [keyword, setKeyword] = useState("");
    const [isCreatingEvent, setCreatingEvent] = useState(false);

    useEffect(() => {
        APIs.event
            .getAll()
            .then((res) => {
                setEvents(res);
            })
            .catch((err) => handleError(err, "發生錯誤", "請求所有促銷活動數據時發生錯誤，請檢查主機連線狀態或聯繫技術人員"));
    }, [history.location.pathname]);

    useEffect(() => {
        if (eventID && eventID.length === 24) {
            Notification.info({
                title: "請稍候",
                description: "正在下載促銷活動 " + eventID + " 的數據 ...",
                key: "getEventData",
                placement: "bottomStart",
            });
            APIs.event
                .get(eventID)
                .then((res) => setEvent(res))
                .catch((err) => handleError(err, "發生錯誤", "請求促銷活動 " + eventID + " 數據時發生錯誤"));
        } else {
            history.push("/event");
            setEvent(undefined);
        }
    }, [eventID, history]);

    const filltedData = () => {
        if (keyword !== "") {
            return events?.filter((event) => {
                if (event.title.includes(keyword)) return true;
                if (event.content.includes(keyword)) return true;
                if (event.id === keyword) return true;
            });
        } else return events;
    };

    const refresh = () => {
        APIs.event
            .getAll()
            .then((res) => setEvents(res))
            .catch((err) => handleError(err, "發生錯誤", "請求所有促銷活動數據時發生錯誤，請檢查主機連線狀態或聯繫技術人員"));
    };

    return (
        <div className="page-container">
            <Row style={{ margin: "32px 0" }}>
                <h1>促銷活動管理</h1>
                <p>點擊促銷活動可以編輯資料</p>
            </Row>

            <Row style={{ marginTop: 18 }}>
                <IconButton onClick={() => setCreatingEvent(true)} icon={<Icon icon="plus" />} placement="right" appearance="primary">
                    新增促銷活動
                </IconButton>
            </Row>

            <Row style={{ marginTop: 36 }}>
                <Input placeholder="使用關鍵字搜尋" value={keyword} onChange={(v) => setKeyword(v)} />
            </Row>
            <Row style={{ marginTop: 36 }}>
                <Table
                    autoHeight
                    data={filltedData()}
                    width={960}
                    onRowClick={(event) => {
                        history.push("/event/" + event.id);
                    }}
                    loading={events === undefined}
                >
                    <Column width={160}>
                        <HeaderCell>狀態</HeaderCell>
                        <Cell>
                            {(rowData: Event) => {
                                return <p>{checkEventIsGoing(rowData)}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={240}>
                        <HeaderCell>標題</HeaderCell>
                        <Cell dataKey="title" />
                    </Column>

                    <Column width={180}>
                        <HeaderCell>開始時間</HeaderCell>
                        <Cell>
                            {(rowData: Event) => {
                                return <p>{dateToFullString(rowData.begin_date)}</p>;
                            }}
                        </Cell>
                    </Column>

                    <Column width={180}>
                        <HeaderCell>結束時間</HeaderCell>
                        <Cell>
                            {(rowData: Event) => {
                                return <p>{dateToFullString(rowData.end_date)}</p>;
                            }}
                        </Cell>
                    </Column>
                </Table>
            </Row>

            <EventDetailDrawer
                event={event}
                onDelete={() => {
                    history.push("/event");
                    refresh();
                }}
                close={() => {
                    history.push("/event");
                }}
            />
            <EventCreateDrawer
                isShowing={isCreatingEvent}
                onCreate={() => {
                    refresh();
                    setCreatingEvent(false);
                }}
                onClose={() => setCreatingEvent(false)} />
        </div>
    );
};

export default EventPage;

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, DatePicker, Loader, Row, Table } from "rsuite";
import ReserveDetailDrawer from "../components/Drawer/ReservationDrawer/ReserveDetailDrawer";
import { useAPIs } from "../hooks/useAPIs";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { Reservation, Therapist } from "../models/definitions";
import "../styles/ReservationPage.scss";
import { getDuration } from "../utils/getDuration";
import timeToString from "../utils/timeToString";

const { Column, HeaderCell, Cell } = Table;

interface RouteParams {
    reserveID: string;
}

const ReservationsPage = () => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const [reserve, setReserve] = useState<Reservation | undefined>();
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoadingReservations, setIsLoadingReservations] = useState(false);

    const { reserveID } = useParams<RouteParams>();

    useEffect(() => {
        setIsLoadingReservations(true);
        const tagetTime = Math.floor(displayDate.setHours(0, 0, 0) / 1000);
        APIs.reservation
            .getAll({ date: tagetTime })
            .then((res) => setReservations(res))
            .catch((err) => handleError(err, "發生錯誤", "在下載預約資料時發生錯誤，請檢查主機連線狀態或聯繫技術人員"))
            .finally(() => setIsLoadingReservations(false));
    }, [displayDate]);

    useEffect(() => {
        setIsLoadingReservations(true);
        APIs.reservation
            .getAll({ date: Math.round(displayDate.getTime() / 1000) })
            .then((res) => setReservations(res))
            .catch((err) => handleError(err, "發生錯誤", "在下載預約資料時發生錯誤，請檢查主機連線狀態或聯繫技術人員"))
            .finally(() => setIsLoadingReservations(false));

        APIs.therapist
            .getAll()
            .then((res) => setTherapists(res))
            .catch((err) => handleError(err, "發生錯誤", "取得所有按摩師資料時發生錯誤，請聯繫客服人員"));
    }, [history.location.pathname]);

    useEffect(() => {
        if (reserveID && reserveID.length === 24) {
            APIs.reservation
                .getData(reserveID)
                .then((res) => setReserve(res))
                .catch((err) => handleError(err, "發生錯誤", "為您查詢預約資料時發生錯誤"));
        } else {
            history.push("/reservation");
            setReserve(undefined);
        }
    }, [reserveID, history]);

    return (
        <div className="reservation-page">
            <div className="page-container">
                <Row style={{ margin: "32px 0" }}>
                    <h1>預約管理</h1>
                </Row>

                <Row style={{ marginTop: 18 }}>
                    <DatePicker style={{ marginLeft: 16 }} value={displayDate} onChange={(v) => setDisplayDate(v)} cleanable={false} />
                </Row>

                <Row>
                    <Col sm={6}>
                        <div className="all-reserve-number">
                            <p>本日總預約數</p>
                            {isLoadingReservations ? <Loader style={{ padding: 18 }}/> : <h2>{reservations.length}</h2>}
                        </div>
                    </Col>
                </Row>

                <ReservationTable therapists={therapists} reservations={reservations} loadingReservations={isLoadingReservations} />

                <Row className="reservation-list">
                    <Table
                        width={960}
                        autoHeight
                        data={reservations}
                        onRowClick={(reservation) => {
                            history.push("/reservation/" + reservation.id);
                        }}
                        loading={reservations === undefined}
                    >
                        <Column width={80}>
                            <HeaderCell>開始時間</HeaderCell>
                            <Cell>{(rowData: Reservation) => timeToString(rowData.start_time)}</Cell>
                        </Column>

                        <Column width={80}>
                            <HeaderCell>結束時間</HeaderCell>
                            <Cell>{(rowData: Reservation) => timeToString(rowData.end_time)}</Cell>
                        </Column>

                        <Column width={240}>
                            <HeaderCell>預約會員</HeaderCell>
                            <Cell>{(rowData: Reservation) => <a href={"/member/" + rowData.member_id}>{rowData.member_id}</a>}</Cell>
                        </Column>

                        <Column width={240}>
                            <HeaderCell>按摩師</HeaderCell>
                            <Cell>
                                {(rowData: Reservation) => <a href={"/therapist/" + rowData.therapist_id}>{rowData.therapist_id}</a>}
                            </Cell>
                        </Column>
                    </Table>
                </Row>

                <ReserveDetailDrawer
                    therapistOptions={therapists}
                    reserve={reserve}
                    close={() => {
                        history.push("/reservation");
                    }}
                />
            </div>
        </div>
    );
};

interface Props {
    therapists: Therapist[];
    reservations: Reservation[];
    loadingReservations: boolean;
}

const ReservationTable = (props: Props) => {
    const history = useHistory();
    const from = 7;
    const to = 24;
    const hours = () => {
        const h = [];
        for (let i = from; i<to; i++) {
            h.push(i);
        }
        return h;
    };

    if (props.loadingReservations) return <></>;

    return (
        <Row className="reservation-table">
            <Col xs={4} className="therapists-col">
                {props.therapists.map((therapist) => (
                    <Row
                        key={therapist.id}
                        style={{ display: "flex", cursor: "pointer", height: 64, padding: 16 }}
                        onClick={() => history.push("/therapist/" + therapist.id)}
                    >
                        <img src={therapist.image_url} alt="avatar" style={{ width: 32, height: 32, borderRadius: 32, marginRight: 12 }} />
                        <div>
                            <p style={{ margin: 0 }}>{therapist.name}</p>
                            <p style={{ margin: 0 }}>
                                本日共 {props.reservations.filter((r) => r.therapist_id === therapist.id).length} 場
                            </p>
                        </div>
                    </Row>
                ))}
            </Col>

            <Col xs={20} style={{ position: "relative" }}>
                <div style={{ width: "100%", overflowX: "scroll", position: "absolute" }}>
                    <div style={{ width: (to-from)*60*5 }}>
                        {props.therapists.map((therapist) => (
                            <Row key={therapist.id} style={{ position: "relative", height: 64, borderBottom: "1px solid rgba(0,0,0,0.2)" }}>
                                {props.reservations
                                    .filter((r) => r.therapist_id === therapist.id)
                                    .map((r) => (
                                        <div
                                            key={r.id}
                                            className="reservation-block"
                                            style={{
                                                left: ((r.start_time.getHours()-from) * 60 +
                                                 r.start_time.getMinutes() - r.buffer_start + 1) * 5,
                                                width: (getDuration(r.start_time, r.end_time) + r.buffer_start + r.buffer_end) * 5,
                                            }}
                                            onClick={() => history.push("/reservation/" + r.id)}
                                        >
                                            <div
                                                className="inner"
                                                style={{
                                                    left: r.buffer_start * 5,
                                                    width: getDuration(r.start_time, r.end_time) * 5,
                                                }}
                                            >
                                                <p>{timeToString(r.start_time) + " 到 " + timeToString(r.end_time)}</p>
                                            </div>
                                        </div>
                                    ))}
                            </Row>
                        ))}
                        {hours().map((h) => (
                            <div
                                key={h}
                                className="hour-line"
                                style={{
                                    position: "absolute",
                                    height: 64 * props.therapists.length,
                                    left: (h-from) * 60 * 5,
                                }}
                            >
                                <p className="inner">{h.toString() + ":00"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ReservationsPage;

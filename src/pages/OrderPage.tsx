import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Notification, Row, Table } from "rsuite";
import OrderDetailDrawer from "../components/Drawer/OrderDrawer/OrderDetailDrawer";
import { useAPIs } from "../hooks/useAPIs";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { Order } from "../models/definitions";
import dateToString from "../utils/dateToString";
import getOrderStatusString from "../utils/getOrderStatusString";

const { Column, HeaderCell, Cell } = Table;

interface RouteParams {
    orderID: string;
}

const OrderPage = () => {
    const APIs = useAPIs();
    const history = useHistory();
    const { handleError } = useErrorHandler();

    const [orders, setOrders] = useState<Order[] | undefined>(undefined);
    const [order, setOrder] = useState<Order | undefined>();
    const { orderID } = useParams<RouteParams>();

    useEffect(() => {
        APIs.order
            .getAll()
            .then((res) => setOrders(res))
            .catch((err) => handleError(err, "發生錯誤", "取得所有訂單資料時發生了錯誤，請檢查主機連線狀態或聯繫客服人員"));
    }, [history.location.pathname]);

    useEffect(() => {
        if (orderID && orderID.length === 24) {
            Notification.info({ title: "請稍候", description: "正在為您下載訂單 " + orderID + "的資料 ...", placement: "bottomStart" });
            APIs.order
                .getData(orderID)
                .then((res) => setOrder(res))
                .catch((err) => handleError(err, "發生錯誤", "取得訂單 " + orderID + " 時發生了錯誤，請檢查主機連線狀態或聯繫客服人員"));
        } else {
            history.push("/order");
            setOrder(undefined);
        }
    }, [orderID, history]);

    return (
        <div className="page-container">
            <Row style={{ margin: "32px 0" }}>
                <h1>儲值訂單管理</h1>
                <p>會員創立的儲值訂單會顯示在下方的表格中</p>
            </Row>

            <Table
                width={960}
                style={{ marginTop: 32 }}
                autoHeight
                data={orders}
                onRowClick={(order) => {
                    history.push("/order/" + order.id);
                }}
                loading={orders === undefined}
                renderEmpty={() => <p>系統中還沒有訂單</p>}
            >
                <Column width={140}>
                    <HeaderCell>建立時間</HeaderCell>
                    <Cell>
                        {(rowData: Order) => {
                            return <p>{dateToString(rowData.create_time, true)}</p>;
                        }}
                    </Cell>
                </Column>

                <Column width={160} fixed>
                    <HeaderCell>會員 ID</HeaderCell>
                    <Cell dataKey="member_id" />
                </Column>

                <Column width={120}>
                    <HeaderCell>儲值金額</HeaderCell>
                    <Cell>
                        {(rowData: Order) => {
                            return <p>NTD $ {rowData.amount} </p>;
                        }}
                    </Cell>
                </Column>

                <Column width={120}>
                    <HeaderCell>訂單狀態</HeaderCell>
                    <Cell>
                        {(rowData: Order) => {
                            return <p> {getOrderStatusString(rowData.status)} </p>;
                        }}
                    </Cell>
                </Column>
            </Table>

            <OrderDetailDrawer
                order={order}
                close={() => {
                    history.push("/order");
                }}
            />
        </div>
    );
};

export default OrderPage;

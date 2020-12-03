import React from "react";
import { useHistory } from "react-router-dom";
import { Button, ControlLabel, Drawer, Form, FormControl, FormGroup, HelpBlock, SelectPicker } from "rsuite";
import { Order } from "../../../models/definitions";
import dateToFullString from "../../../utils/dateToFullString";
import getOrderStatusString from "../../../utils/getOrderStatusString";

const OrderDetailDrawer = (props: { order: Order | undefined; close: () => void }) => {
    const order = props.order;
    const history = useHistory();
    return (
        <Drawer
            placement="right"
            show={order !== undefined}
            onHide={() => {
                history.push("/order");
            }}
            size="lg"
        >
            <Drawer.Header>
                <Drawer.Title>訂單詳情 {order?.id}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {order ? (
                    <Form formValue={order}>
                        <FormGroup>
                            <ControlLabel>創建日期</ControlLabel>
                            <ControlLabel>{dateToFullString(order.create_time)}</ControlLabel>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>會員 ID</ControlLabel>
                            <ControlLabel>{order.member_id}</ControlLabel>
                            <Button appearance="primary" onClick={() => history.push("/member/" + order.member_id)}>
                                查看會員資料
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>儲值金額</ControlLabel>
                            {order.status === "UNPAID" ? <FormControl name="amount" /> : <ControlLabel>NTD $ {order.amount}</ControlLabel>}
                            {order.status !== "UNPAID" ? (
                                <HelpBlock>只有尚未付款的訂單可以修改儲值金額</HelpBlock>
                            ) : (
                                <HelpBlock>若顧客已經取得付款頁面，修改訂單金額將導致錯誤的儲值金額入帳，請謹慎使用</HelpBlock>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>狀態</ControlLabel>
                            <FormControl
                                accepter={SelectPicker}
                                name="status"
                                cleanable={false}
                                searchable={false}
                                data={[
                                    { value: "SUCCESS", label: getOrderStatusString("SUCCESS") },
                                    { value: "UNPAID", label: getOrderStatusString("UNPAID") },
                                    { value: "INVALID", label: getOrderStatusString("INVALID") },
                                ]}
                            />
                            <HelpBlock>直接修改訂單狀態並不會影響會員的餘額</HelpBlock>
                        </FormGroup>
                    </Form>
                ) : (
                    <></>
                )}
            </Drawer.Body>
            <Drawer.Footer>
                <Button appearance="primary" disabled>
                    更新訂單資料
                </Button>
                <Button appearance="subtle" onClick={() => props.close()}>
                    關閉
                </Button>
            </Drawer.Footer>
        </Drawer>
    );
};

export default OrderDetailDrawer;

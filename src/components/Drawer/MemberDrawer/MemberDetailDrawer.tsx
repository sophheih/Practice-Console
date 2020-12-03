/* eslint-disable camelcase */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, ControlLabel, DatePicker, Drawer, Form, FormControl, FormGroup, InputNumber, Loader, Notification, Toggle } from "rsuite";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { Member } from "../../../models/definitions";
import DeleteComfirm from "../../DeleteComfirm";

const MemberDetailDrawer = (props: { member: Member | undefined; onDelete: () => void; close: () => void }) => {
    const history = useHistory();
    const { handleError } = useErrorHandler();
    const APIs = useAPIs();

    const member = props.member;
    const deleteComfirm = React.createRef<DeleteComfirm>();

    const [newData, setNewData] = useState<Member | undefined>(props.member);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setNewData(props.member);
    }, [props.member]);

    const updateMember = () => {
        if (newData) {
            Notification.info({
                title: "請稍候",
                description: "正在更新會員 " + newData.username + " 的數據 ...",
                placement: "bottomStart",
            });
            setIsUpdating(true);
            APIs.member
                .update(newData)
                .then(() => props.close())
                .catch((err) => handleError(err, "更新會員時發生錯誤", "請檢查主機狀態或聯繫技術人員處理"))
                .finally(() => setIsUpdating(false));
        }
    };

    const deleteMember = () => {
        if (newData) {
            APIs.member
                .delete(newData)
                .then(() => {
                    props.onDelete();
                    Notification.closeAll();
                    props.close();
                })
                .catch((err) => {
                    handleError(err, "發生錯誤", "刪除會員時發生錯誤，請檢查主機連線狀態或聯繫技術人員");
                });
        }
    };
    return (
        <Drawer
            placement="right"
            show={member !== undefined}
            onHide={() => {
                history.push("/member");
            }}
            size="lg"
        >
            <Drawer.Header>
                <Drawer.Title>會員 {member?.username}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {newData ? (
                    <Form formValue={newData}>
                        <FormGroup>
                            <ControlLabel>真實姓名</ControlLabel>
                            <FormControl name="real_name" onChange={(v) => setNewData({ ...newData, real_name: v })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>VIP</ControlLabel>
                            <FormControl
                                name="vip"
                                checked={newData.vip}
                                accepter={Toggle}
                                onChange={(v) => setNewData({ ...newData, vip: v })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>電子信箱</ControlLabel>
                            <FormControl name="email" type="email" onChange={(v) => setNewData({ ...newData, email: v })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>剩餘儲值金</ControlLabel>
                            <FormControl name="balance" accepter={InputNumber} onChange={(v) => setNewData({ ...newData, balance: +v })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>手機號碼</ControlLabel>
                            <FormControl name="cellphone" onChange={(v) => setNewData({ ...newData, cellphone: v })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>生日</ControlLabel>
                            <FormControl
                                name="birthday"
                                accepter={DatePicker}
                                placement="auto"
                                onChange={(v) => setNewData({ ...newData, birthday: v })}
                            />
                        </FormGroup>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button color="red" appearance="ghost" style={{ float: "left" }} onClick={() => deleteComfirm.current?.open()}>
                    刪除會員
                </Button>
                <Button appearance="primary" disabled={isUpdating} onClick={() => updateMember()}>
                    更新會員資料
                </Button>
                <Button appearance="subtle" onClick={() => props.close()}>
                    關閉
                </Button>
                <DeleteComfirm ref={deleteComfirm} content="確定要刪除此會員嗎?" onComfirm={() => deleteMember()}></DeleteComfirm>
            </Drawer.Footer>
        </Drawer>
    );
};

export default MemberDetailDrawer;

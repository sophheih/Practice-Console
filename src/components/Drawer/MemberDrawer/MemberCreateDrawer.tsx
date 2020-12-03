/* eslint-disable camelcase */

import React, { useState } from "react";
import { Button, Col, ControlLabel, DatePicker, Drawer, Form, FormControl, FormGroup, Loader, Notification, SelectPicker } from "rsuite";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { defaultMember, Member } from "../../../models/definitions";

interface Props {
    onClose: () => void;
    isShowing: boolean;
}

const MemberCreateDrawer = (props: Props) => {
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const [member, setMember] = useState<Member>(defaultMember);

    const createMember = () => {
        APIs.member
            .create(member)
            .then(() => {
                setMember(defaultMember);
                Notification.closeAll();
                props.onClose();
            })
            .catch((err: any) => handleError(err, "發生錯誤", "新增會員資料時發生錯誤"));
    };

    return (
        <Drawer placement="right" show={props.isShowing} onHide={props.onClose} size="lg">
            <Drawer.Header>
                <Drawer.Title>會員 {member.username}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {member ? (
                    <Form formValue={member}>
                        <Col xs={6}>
                            <FormGroup>
                                <ControlLabel>使用者名稱</ControlLabel>
                                <FormControl name="username" onChange={(data) => setMember({ ...member, username: data })} />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>真實姓名</ControlLabel>
                                <FormControl name="real_name" onChange={(data) => setMember({ ...member, real_name: data })} />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>密碼</ControlLabel>
                                <FormControl name="password" onChange={(data) => setMember({ ...member, password: data })} />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>性別</ControlLabel>
                                <FormControl
                                    accepter={SelectPicker}
                                    name="gender"
                                    cleanable={false}
                                    searchable={false}
                                    data={[
                                        { value: "男", label: "男性" },
                                        { value: "女", label: "女性" },
                                        { value: "其他", label: "其他" },
                                    ]}
                                    onChange={(data) => setMember({ ...member, gender: data })}
                                />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>手機號碼</ControlLabel>
                                <FormControl name="cellphone" onChange={(data) => setMember({ ...member, cellphone: data })} />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>電子信箱</ControlLabel>
                                <FormControl name="email" type="email" onChange={(data) => setMember({ ...member, email: data })} />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>生日</ControlLabel>
                                <FormControl
                                    name="birthday"
                                    placement="auto"
                                    accepter={DatePicker}
                                    onChange={(data) => setMember({ ...member, birthday: data })}
                                />
                            </FormGroup>
                        </Col>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>

            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button appearance="primary" onClick={createMember}>
                    新增會員
                </Button>
                <Button appearance="subtle" onClick={close}>
                    關閉
                </Button>
            </Drawer.Footer>
        </Drawer>
    );
};

export default MemberCreateDrawer;

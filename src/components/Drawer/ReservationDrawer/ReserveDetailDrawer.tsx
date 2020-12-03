/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
    Button,
    ControlLabel,
    DatePicker,
    Drawer,
    Form,
    FormControl,
    FormGroup,
    HelpBlock,
    InputNumber,
    Message,
    Row,
    SelectPicker,
} from "rsuite";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { Address, Reservation, Therapist } from "../../../models/definitions";
import { ObjectID } from "../../../models/types";
import isSameAddress from "../../../utils/isSameAddress";

interface Props {
    reserve: Reservation | undefined;
    therapistOptions: Therapist[];
    close: () => void;
}

const ReserveDetailDrawer = (props: Props) => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const [newData, setNewData] = useState<Reservation | undefined>(props.reserve);
    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        setNewData(props.reserve);
        if (props.reserve) {
            APIs.member
                .getAddresses(props.reserve.member_id)
                .then((res) => setAddresses(res))
                .catch((err) => handleError(err, "發生錯誤", "查詢用戶地址資料時發生錯誤"));
        }
    }, [props.reserve]);

    const deleteReservation = () => {
        if (newData) {
            APIs.reservation
                .delete(newData.id)
                .then(() => props.close())
                .catch((err) => handleError(err, "發生錯誤", "刪除預約時發生了未知的錯誤"));
        }
    };

    const updateReservation = () => {
        if (newData) {
            APIs.reservation
                .update(newData)
                .then(() => props.close())
                .catch((err) => handleError(err, "發生錯誤", "更新預約資料時發生錯誤"));
        }
    };

    const addressOptions = (): { value: ObjectID; label: string; address: Address }[] => {
        const originAddress = props.reserve?.address;
        if (newData && originAddress) {
            if (addresses.find((a) => isSameAddress(a, originAddress)) !== undefined) {
                return addresses.map((op) => {
                    return { value: op.id, label: op.city + " " + op.district + " " + op.detail, address: op };
                });
            } else {
                return [
                    ...addresses.map((op) => {
                        return { value: op.id, label: op.city + " " + op.district + " " + op.detail, address: op };
                    }),
                    {
                        value: originAddress.id + "(old)",
                        label: originAddress.city + " " + originAddress.district + " " + originAddress.detail,
                        address: originAddress,
                    },
                ];
            }
        } else {
            return [];
        }
    };

    const handleAddressChange = (addressID: ObjectID) => {
        const addressInOptions = addressOptions().find((a) => a.value === addressID);
        if (newData && addressInOptions) {
            setNewData({ ...newData, address: addressInOptions.address });
        }
    };

    return (
        <Drawer
            placement="right"
            show={newData !== undefined}
            onHide={() => {
                history.push("/reservation");
            }}
        >
            <Drawer.Header>
                <Drawer.Title>預約詳細資訊</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form formValue={newData}>

                    <FormGroup>
                        <ControlLabel>預約編號</ControlLabel>
                        <p>{newData?.id}</p>
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>預約會員</ControlLabel>
                        <Button
                            appearance="link"
                            onClick={() => history.push("/member/" + newData?.member_id)}
                        >
                            {newData?.member_id}
                        </Button>
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>按摩師</ControlLabel>
                        <FormControl
                            accepter={SelectPicker}
                            value={newData?.therapist_id}
                            data={props.therapistOptions.map((op) => {
                                return { value: op.id, label: op.name };
                            })}
                            cleanable={false}
                            searchable={false}
                            onChange={(v) => setNewData(newData ? { ...newData, therapist_id: v } : undefined)}
                        />
                    </FormGroup>

                    {newData ? (
                        <FormGroup>
                            <ControlLabel>預約地址</ControlLabel>
                            <FormControl
                                accepter={SelectPicker}
                                value={
                                    addresses.map((a) => a.id).includes(newData.address.id) ?
                                        newData.address.id :
                                        newData.address.id + "(old)"
                                }
                                data={addressOptions()}
                                cleanable={false}
                                searchable={false}
                                onChange={handleAddressChange}
                            />

                            {addresses.find((a) => isSameAddress(a, newData?.address)) ? (
                                <></>
                            ) : (
                                <Message
                                    style={{ marginTop: 12, width: 240 }}
                                    type="warning"
                                    showIcon
                                    description="注意：該地址已被會員刪除"
                                />
                            )}
                        </FormGroup>
                    ) : (
                        <></>
                    )}

                    <FormGroup>
                        <p style={{ marginBottom: 8 }}>服務項目</p>
                        {props.reserve?.services_id.map((s) => (
                            <Row
                                key={s.id}
                                style={{ display: "flex", alignItems: "center", cursor: "pointer", width: "80%" }}
                                onClick={() => history.push("/service/" + s.id)}
                            >
                                <img
                                    src={s.image_url[0]}
                                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }}
                                    alt={s.id}
                                />
                                <p style={{ marginLeft: 16 }}>{s.title}</p>
                            </Row>
                        ))}
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>服務開始時間</ControlLabel>
                        <FormControl
                            accepter={DatePicker}
                            value={newData?.start_time}
                            format="YYYY-MM-DD HH:mm:ss"
                            cleanable={false}
                            onChange={(v) => setNewData(newData ? { ...newData, start_time: v } : undefined)}
                        />
                        <HelpBlock>按摩師開始進行第一項服務的時間</HelpBlock>
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>前緩衝時間</ControlLabel>
                        <FormControl
                            style={{ width: 160 }}
                            accepter={InputNumber}
                            value={newData?.buffer_start}
                            format="YYYY-MM-DD HH:mm:ss"
                            cleanable={false}
                            postfix="分鐘"
                            onChange={(v) => setNewData(newData ? { ...newData, buffer_start: +v.toString() } : undefined)}
                        />
                        <HelpBlock>按摩師前往預約地點的通勤時間以及前置作業的準備時間</HelpBlock>
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>後緩衝時間</ControlLabel>
                        <FormControl
                            style={{ width: 160 }}
                            accepter={InputNumber}
                            value={newData?.buffer_end}
                            format="YYYY-MM-DD HH:mm:ss"
                            cleanable={false}
                            postfix="分鐘"
                            onChange={(v) => setNewData(newData ? { ...newData, buffer_end: +v.toString() } : undefined)}
                        />
                        <HelpBlock>按摩師善後作業的所需時間以及離開預約地點的通勤時間</HelpBlock>
                    </FormGroup>
                </Form>
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button color="red" appearance="ghost" style={{ float: "left" }} onClick={() => deleteReservation()}>
                    刪除預約
                </Button>
                <Button appearance="primary" onClick={() => updateReservation()}>
                    更新預約資料
                </Button>
                <Button appearance="subtle" onClick={() => props.close()}>
                    關閉
                </Button>
            </Drawer.Footer>
        </Drawer>
    );
};

export default ReserveDetailDrawer;

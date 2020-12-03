/* eslint-disable camelcase */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, ControlLabel, Drawer, Form, FormControl, FormGroup, Loader, Notification, SelectPicker, Uploader } from "rsuite";
import { FileType } from "rsuite/lib/Uploader";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { Therapist } from "../../../models/definitions";
import DeleteComfirm from "../../DeleteComfirm";

const TherapistDetailDrawer = (props: { therapist: Therapist | undefined; onDelete: () => void; close: () => void }) => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const deleteComfirm = React.createRef<DeleteComfirm>();

    const [newData, setNewData] = useState<Therapist | undefined>(props.therapist);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setNewData(props.therapist);
    }, [props.therapist]);

    const updateTherapist = () => {
        if (newData) {
            Notification.info({
                title: "請稍候",
                description: "正在為您更新按摩師資料 ...",
                placement: "bottomStart",
            });
            setIsUpdating(true);
            APIs.therapist
                .update(newData)
                .then(() => props.close())
                .catch((err) => handleError(err, "發生錯誤", "更新服務項目資料時發生錯誤，請檢查主機連線狀態或聯繫技術人員"))
                .finally(() => setIsUpdating(false));
        }
    };

    const deleteTherapist = () => {
        if (newData) {
            APIs.therapist
                .delete(newData)
                .then(() => {
                    props.onDelete();
                    Notification.closeAll();
                    props.close();
                })
                .catch((err) => {
                    handleError(err, "發生錯誤", "刪除師傅時發生錯誤，請檢查主機連線狀態或聯繫技術人員");
                });
        }
    };

    const uploadImage = (img: FileType) => {
        if (newData) {
            Notification.info({
                title: "請稍候",
                description: "正在為您上傳圖片 ...",
                placement: "bottomStart",
            });
            APIs.image
                .upload(img)
                .then((res) => {
                    setNewData({ ...newData, image_url: res.url });
                })
                .catch((err) => {
                    if (err !== "EMPTY_FILE") {
                        handleError(err, "發生錯誤", "上傳照片到資料庫時發生問題，請檢查主機連線狀態或聯繫技術人員");
                    }
                });
        }
        return false;
    };

    return (
        <Drawer
            placement="right"
            show={props.therapist !== undefined}
            onHide={() => {
                history.push("/therapist");
            }}
            size="lg"
        >
            <Drawer.Header>
                <Drawer.Title>按摩師 {props.therapist?.name}</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
                {newData ? (
                    <Form formValue={newData}>
                        <Col xs={6}>
                            <Uploader
                                listType="picture"
                                fileListVisible={false}
                                shouldUpload={uploadImage}
                                onChange={(v) => setNewData({ ...newData, image_url: v[0].url ? v[0].url : "" })}
                            >
                                <button style={{ width: 200, height: 200 }}>
                                    <img style={{ width: "100%" }} src={newData.image_url} alt="therapist" />
                                </button>
                            </Uploader>
                        </Col>
                        <Col xs={6}>
                            <FormGroup>
                                <ControlLabel>姓名</ControlLabel>
                                <FormControl name="name" onChange={(name) => setNewData({ ...newData, name })} />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>介紹</ControlLabel>
                                <FormControl name="description" onChange={(description) => setNewData({ ...newData, description })} />
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
                                    onChange={(gender) => setNewData({ ...newData, gender })}
                                />
                            </FormGroup>
                        </Col>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button color="red" appearance="ghost" style={{ float: "left" }} onClick={() => deleteComfirm.current?.open()}>
                    刪除按摩師
                </Button>
                <Button appearance="primary" disabled={isUpdating} onClick={() => updateTherapist()}>
                    更新按摩師資料
                </Button>
                <Button appearance="subtle" onClick={() => props.close()}>
                    關閉
                </Button>
                <DeleteComfirm ref={deleteComfirm} content="確定要刪除此項活動嗎?" onComfirm={() => deleteTherapist()}></DeleteComfirm>
            </Drawer.Footer>
        </Drawer>
    );
};

export default TherapistDetailDrawer;

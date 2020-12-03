/* eslint-disable camelcase */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, ControlLabel, DatePicker, Drawer, Form, FormControl, FormGroup, Loader, Notification, Uploader } from "rsuite";
import { FileType } from "rsuite/lib/Uploader";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { Event } from "../../../models/definitions";
import DeleteComfirm from "../../DeleteComfirm";

const EventDetailDrawer = (props: { event: Event | undefined; onDelete: () => void; close: () => void }) => {
    const history = useHistory();
    const { handleError } = useErrorHandler();
    const APIs = useAPIs();

    const deleteComfirm = React.createRef<DeleteComfirm>();
    const event = props.event;

    const [newEvent, setNewEvent] = useState<Event | undefined>(event);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [isUploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        setNewEvent(props.event);
    }, [props.event]);

    const updateEvent = () => {
        if (newEvent) {
            Notification.info({
                title: "請稍候",
                description: "正在更新該促銷活動的資料 ...",
                placement: "bottomStart",
            });
            setIsUpdating(true);
            APIs.event
                .update(newEvent)
                .then(() => props.close())
                .catch((err) => handleError(err, "發生錯誤", "更新促銷活動資料時發生錯誤"))
                .finally(() => setIsUpdating(false));
        }
    };

    const deleteEvent = () => {
        if (newEvent) {
            setDeleting(true);
            APIs.event
                .delete(newEvent)
                .then(() => {
                    props.onDelete();
                    Notification.closeAll();
                    props.close();
                })
                .catch((err) => {
                    handleError(err, "發生錯誤", "刪除服務項目資料時發生錯誤，請檢查主機連線狀態或聯繫技術人員");
                }).finally(() => setDeleting(false));
        }
    };
    const uploadImage = (img: FileType) => {
        if (newEvent) {
            setUploadingImage(true);
            Notification.info({
                title: "請稍候",
                description: "正在為您上傳圖片 ...",
                placement: "bottomStart",
            });
            APIs.image
                .upload(img)
                .then((res) => {
                    setNewEvent({ ...newEvent, image_url: res.url });
                })
                .catch((err) => {
                    if (err !== "EMPTY_FILE") {
                        handleError(err, "發生錯誤", "上傳照片到資料庫時發生問題，請檢查主機連線狀態或聯繫技術人員");
                    }
                }).finally(() => setUploadingImage(false));
        }
        return false;
    };

    return (
        <Drawer
            placement="right"
            show={event !== undefined}
            onHide={() => {
                history.push("/event");
            }}
            size="lg"
        >
            <Drawer.Header>
                <Drawer.Title>促銷活動 {event?.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {newEvent ? (
                    <Form formValue={newEvent}>
                        <Uploader
                            listType="picture"
                            fileListVisible={false}
                            shouldUpload={uploadImage}
                            onChange={(v) => setNewEvent({ ...newEvent, image_url: v[0].url ? v[0].url : "" })}
                        >
                            <button style={{ width: 200, height: 200 }}>
                                <img style={{ width: "100%" }} src={newEvent.image_url} alt="therapist" />
                            </button>
                        </Uploader>
                        <FormGroup>
                            <ControlLabel>標題</ControlLabel>
                            <FormControl name="title" onChange={(v) => setNewEvent({ ...newEvent, title: v })} />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>內容</ControlLabel>
                            <FormControl
                                name="content"
                                componentClass="textarea"
                                onChange={(v) => setNewEvent({ ...newEvent, content: v })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>開始日期</ControlLabel>
                            <FormControl
                                name="begin_date"
                                placement="auto"
                                accepter={DatePicker}
                                onChange={(v) => setNewEvent({ ...newEvent, begin_date: v })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>結束日期</ControlLabel>
                            <FormControl
                                name="end_date"
                                placement="auto"
                                accepter={DatePicker}
                                onChange={(v) => setNewEvent({ ...newEvent, end_date: v })}
                            />
                        </FormGroup>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button
                    color="red"
                    appearance="ghost"
                    style={{ float: "left" }}
                    onClick={() => deleteComfirm.current?.open()}
                    loading={isDeleting}
                >
                    刪除活動
                </Button>
                <Button appearance="primary" loading={isUpdating} onClick={() => updateEvent()} disabled={isUploadingImage}>
                    更新促銷活動資料
                </Button>
                <Button appearance="subtle" onClick={() => props.close()}>
                    關閉
                </Button>
                <DeleteComfirm ref={deleteComfirm} content="確定要刪除此項活動嗎?" onComfirm={() => deleteEvent()}></DeleteComfirm>
            </Drawer.Footer>
        </Drawer>
    );
};

export default EventDetailDrawer;

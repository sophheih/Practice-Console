/* eslint-disable camelcase */

import React, { useState } from "react";
import { Button, ControlLabel, DatePicker, Drawer, Form, FormControl, FormGroup, Loader, Uploader } from "rsuite";
import { API_URL } from "../../../config";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useToken } from "../../../hooks/useToken";
import { defaultEvent, Event, Image } from "../../../models/definitions";

interface Props {
    onCreate: () => void;
    onClose: () => void;
    isShowing: boolean;
}

const EventCreateDrawer = (props: Props) => {
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();
    const { token } = useToken();

    const [event, setEvent] = useState<Event>(defaultEvent);

    const [image, setImage] = useState<Image | undefined>();
    const imageApiUploadUrl = `${API_URL}/image/`;
    const [uploadImageExt, setUploadImageExt] = useState("jpg");
    const uploader: React.RefObject<any> = React.createRef<any>();
    const [imageSrc, setImgSrc] = useState("");

    const [isUploadingImage, setUploadingImage] = useState(false);
    const [isCreating, setCreating] = useState(false);

    const onUploadImage = (file: any) => {
        setUploadingImage(true);
        setUploadImageExt(file.name.split(".")[1]);
    };

    const onChangeImage = () => {
        if (image) {
            setUploadingImage(true);
            APIs.image
                .delete(image)
                .then(() => {
                    setUploadingImage(false);
                })
                .catch((err) => handleError(err, "發生錯誤", "刪除圖片時發生錯誤，請聯繫技術人員處理"));
            setImage(undefined);
        }
    };

    const onSuccessUpload = (res: any) => {
        setImage(res);
        setUploadingImage(false);
        if (res) {
            setEvent((e) => {
                return { ...e, image_url: res.url };
            });
            setImgSrc(res.url);
        }
    };

    const createEvent = () => {
        setCreating(true);
        APIs.event
            .create(event)
            .then(props.onCreate)
            .catch((err) => handleError(err, "發生錯誤", "新增促銷活動資料時發生錯誤"))
            .finally(() => setCreating(false));
    };

    return (
        <Drawer placement="right" show={props.isShowing} onHide={props.onClose} size="lg">
            <Drawer.Header>
                <Drawer.Title>新增促銷活動 {event.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {event ? (
                    <Form formValue={event}>
                        <Uploader
                            ref={uploader}
                            listType="picture"
                            fileListVisible={false}
                            onUpload={onUploadImage}
                            onError={(reason) => console.error(reason)}
                            onSuccess={onSuccessUpload}
                            onChange={onChangeImage}
                            name="image"
                            multiple={false}
                            data={{ ext: uploadImageExt }}
                            headers={{ Authorization: "Token " + token }}
                            action={imageApiUploadUrl}
                            draggable
                            disabled={isUploadingImage}
                        >
                            {imageSrc !== "" ? (
                                <button style={{ width: 200, height: 200 }}>
                                    <img style={{ width: "100%" }} src={imageSrc} alt="event" />
                                </button>
                            ) : (
                                isUploadingImage ? <Loader style={{ width: 200, height: 200, lineHeight: "200px" }} /> :
                                    <div style={{ width: 200, height: 200, lineHeight: "200px" }}>上傳活動圖片</div>
                            )}
                        </Uploader>
                        <FormGroup>
                            <ControlLabel>標題</ControlLabel>
                            <FormControl
                                name="title"
                                onChange={(v) =>
                                    setEvent((e) => {
                                        return { ...e, title: v };
                                    })
                                }
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>內容</ControlLabel>
                            <FormControl
                                name="content"
                                componentClass="textarea"
                                onChange={(v) => {
                                    setEvent((e) => {
                                        return { ...e, content: v };
                                    });
                                }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>開始日期</ControlLabel>
                            <FormControl
                                name="begin_date"
                                placement="auto"
                                accepter={DatePicker}
                                onChange={(v) => {
                                    setEvent((e) => {
                                        return { ...e, begin_date: v };
                                    });
                                }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>結束日期</ControlLabel>
                            <FormControl
                                name="end_date"
                                placement="auto"
                                accepter={DatePicker}
                                onChange={(v) => {
                                    setEvent((e) => {
                                        return { ...e, end_date: v };
                                    });
                                }}
                            />
                        </FormGroup>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button appearance="primary" onClick={createEvent} loading={isCreating} disabled={isUploadingImage}>
                    新增促銷活動
                </Button>
                <Button appearance="subtle" onClick={props.onClose}>
                    關閉
                </Button>
            </Drawer.Footer>
        </Drawer>
    );
};

export default EventCreateDrawer;

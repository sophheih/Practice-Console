/* eslint-disable camelcase */

import React, { useState } from "react";
import { Button, Col, ControlLabel, Drawer, Form, FormControl, FormGroup, Loader, SelectPicker, Uploader } from "rsuite";
import { API_URL } from "../../../config";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useToken } from "../../../hooks/useToken";
import { defaultTherapist, Image, Therapist } from "../../../models/definitions";

interface Props {
    isShowing: boolean;
    onCreated: () => void;
    onClose: () => void;
}

const TherapistCreateDrawer = (props: Props) => {
    const APIs = useAPIs();
    const { token } = useToken();
    const { handleError } = useErrorHandler();

    const [image, setImage] = useState<Image | undefined>();
    const [therapist, setTherapist] = useState<Therapist>(defaultTherapist);
    const imageApiUploadUrl = `${API_URL}/image/`;
    const [uploadImageExt, setUploadImageExt] = useState("jpg");
    const uploader: React.RefObject<any> = React.createRef<any>();
    const [imageSrc, setImageSrc] = useState("");

    const [isCreating, setCreating] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isUploadingImage, setUploadingImage] = useState(false);


    const onUploadImage = (file: any) => {
        setUploadingImage(true);
        setUploadImageExt(file.name.split(".")[1]);
    };

    const onChangeImage = () => {
        if (image) {
            setUploadingImage(true);
            APIs.image
                .delete(image)
                .then(() =>
                    setUploadingImage(false))
                .catch((err) => handleError(err, "發生錯誤", "刪除圖片時發生錯誤，請聯繫技術人員處理"));
            setImage(undefined);
        }
    };

    const onSuccessUpload = (res: any) => {
        setUploadingImage(false);
        setImage(res);
        if (res) {
            setTherapist({ ...therapist, image_url: res.url });
            setImageSrc(res.url);
        }
    };

    const createTherapist = () => {
        setCreating(true);
        APIs.therapist
            .create(therapist)
            .then(props.onCreated)
            .catch((err) => handleError(err, "發生錯誤", "新增按摩師資料時發生錯誤")).finally(() => setCreating(false));
    };

    return (
        <Drawer
            placement="right"
            show={props.isShowing}
            onHide={props.onClose}
            size="lg"
        >
            <Drawer.Header>
                <Drawer.Title>按摩師 {therapist.name}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {therapist ? (
                    <Form formValue={therapist}>
                        <Col xs={6}>
                            <Uploader
                                ref={uploader}
                                listType="picture"
                                fileListVisible={false}
                                onUpload={(file) => {
                                    onUploadImage(file);
                                }}
                                onError={(reason) => console.log(reason)}
                                onSuccess={(response) => onSuccessUpload(response)}
                                onChange={() => onChangeImage()}
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
                                        <div style={{ width: 200, height: 200, lineHeight: "200px" }}>上傳按摩師圖片</div>
                                )}
                            </Uploader>
                        </Col>
                        <Col xs={6}>
                            <FormGroup>
                                <ControlLabel>姓名</ControlLabel>
                                <FormControl
                                    name="name"
                                    onChange={(name) => {
                                        therapist.name = name;
                                    }}
                                />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>介紹</ControlLabel>
                                <FormControl
                                    name="description"
                                    onChange={(description) => {
                                        therapist.description = description;
                                    }}
                                />
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
                                    onChange={(v) => (therapist.gender = v)}
                                />
                            </FormGroup>
                        </Col>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>

            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button appearance="primary" onClick={createTherapist} loading={isCreating}>
                    新增按摩師
                </Button>
                <Button appearance="subtle" onClick={() => close()}>
                    關閉
                </Button>
            </Drawer.Footer>
        </Drawer>
    );
};

export default TherapistCreateDrawer;

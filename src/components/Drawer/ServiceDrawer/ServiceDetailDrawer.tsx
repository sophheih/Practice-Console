/* eslint-disable camelcase */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, ControlLabel, Drawer, Form, FormControl, FormGroup, HelpBlock, InputNumber, Loader, Notification, Uploader } from "rsuite";
import { FileType } from "rsuite/lib/Uploader";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { Service } from "../../../models/definitions";
import DeleteComfirm from "../../DeleteComfirm";

const ServiceDetailDrawer = (props: { service: Service | undefined; close: () => void }) => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const deleteComfirm = React.createRef<DeleteComfirm>();
    const service = props.service;

    const [newService, setNewService] = useState<Service | undefined>(service);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setNewService(props.service);
    }, [props.service]);

    const updateService = () => {
        if (newService) {
            Notification.info({
                title: "請稍候",
                description: "正在為您更新服務項目資料 ...",
                placement: "bottomStart",
            });
            setIsUpdating(true);
            APIs.service
                .update(newService)
                .then(() => props.close())
                .catch((err) => handleError(err, "發生錯誤", "更新服務項目資料時發生錯誤，請檢查主機連線狀態或聯繫技術人員"))
                .finally(() => setIsUpdating(false));
        }
    };

    const deleteService = () => {
        if (newService) {
            APIs.service
                .delete(newService)
                .then(() => props.close())
                .catch((err) => {
                    handleError(err, "發生錯誤", "更新服務項目資料時發生錯誤，請檢查主機連線狀態或聯繫技術人員");
                });
        }
    };
    const uploadImage = (img: FileType) => {
        if (newService) {
            Notification.info({
                title: "請稍候",
                description: "正在為您上傳圖片 ...",
                placement: "bottomStart",
                key: "uploadingImage",
                duration: 0,
            });
            setIsUpdating(true);
            APIs.image
                .upload(img)
                .then((res) => {
                    Notification.close("uploadingImage");
                    setNewService({ ...newService, image_url: [...newService.image_url, res.url] });
                })
                .catch((err) => {
                    if (err !== "EMPTY_FILE") {
                        Notification.close("uploadingImage");
                        handleError(err, "發生錯誤", "上傳照片到資料庫時發生問題，請檢查主機連線狀態或聯繫技術人員");
                    }
                })
                .finally(() => setIsUpdating(false));
        }
        return false;
    };

    const getFIleList = (images: string[]) => {
        return images.map((img) => ({
            name: img,
            fileKey: img,
            url: img,
        }));
    };

    return (
        <Drawer
            placement="right"
            show={service !== undefined}
            onHide={() => {
                history.push("/service");
            }}
            size="lg"
        >
            <Drawer.Header>
                <Drawer.Title>服務項目 {service?.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {newService ? (
                    <Form formValue={newService}>
                        <Uploader
                            listType="picture"
                            defaultFileList={getFIleList(newService.image_url)}
                            shouldUpload={uploadImage}
                            onRemove={(f) =>
                                setNewService({ ...newService, image_url: newService.image_url.filter((file) => file !== f.fileKey) })
                            }
                        />

                        <FormGroup>
                            <ControlLabel>服務標題</ControlLabel>
                            <FormControl name="title" onChange={(v) => setNewService({ ...newService, title: v })} />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>短描述</ControlLabel>
                            <FormControl
                                name="short_description"
                                componentClass="textarea"
                                onChange={(v) => setNewService({ ...newService, short_description: v })}
                            />
                            <HelpBlock>在這裡輸入該服務的簡短敘述，會顯示於 App 的服務列表頁面</HelpBlock>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>長描述</ControlLabel>
                            <FormControl
                                name="long_description"
                                componentClass="textarea"
                                onChange={(v) => setNewService({ ...newService, long_description: v })}
                            />
                            <HelpBlock>在這裡輸入該服務的完整敘述，會顯示於 App 的服務詳情頁面</HelpBlock>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>所需時間</ControlLabel>
                            <FormControl
                                name="duration"
                                accepter={InputNumber}
                                onChange={(v) => setNewService({ ...newService, duration: +v })}
                            />
                            <HelpBlock>單位為分鐘</HelpBlock>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>定價</ControlLabel>
                            <FormControl
                                prefix="$"
                                name="price"
                                accepter={InputNumber}
                                onChange={(v) => setNewService({ ...newService, price: +v })}
                            />
                            <HelpBlock>單位為新台幣</HelpBlock>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>一般會員折扣比例</ControlLabel>
                            <FormControl name="nor_per" onChange={(v) => setNewService({ ...newService, nor_per: v })} />
                            <HelpBlock>輸入 1 代表一般會員原價，輸入 0.8 代表一般會員 8 折，輸入 0.5 代表一般會員半價</HelpBlock>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>VIP 會員折扣比例</ControlLabel>
                            <FormControl name="vip_per" onChange={(v) => setNewService({ ...newService, vip_per: v })} />
                            <HelpBlock>輸入 1 代表 VIP 會員原價，輸入 0.8 代表 VIP 會員 8 折，輸入 0.5 代表 VIP 會員半價</HelpBlock>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>折扣金額</ControlLabel>
                            <FormControl name="minus" onChange={(v) => setNewService({ ...newService, minus: v })} />
                            <HelpBlock>輸入 300 代表優惠價為原價折扣 300 元</HelpBlock>
                        </FormGroup>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button color="red" appearance="ghost" style={{ float: "left" }} onClick={() => deleteComfirm.current?.open()}>
                    刪除服務
                </Button>
                <Button appearance="primary" disabled={isUpdating} onClick={() => updateService()}>
                    更新服務資料
                </Button>
                <Button appearance="subtle" onClick={() => props.close()}>
                    關閉
                </Button>
                <DeleteComfirm ref={deleteComfirm} content="確定要刪除此項服務嗎?" onComfirm={() => deleteService()}></DeleteComfirm>
            </Drawer.Footer>
        </Drawer>
    );
};

export default ServiceDetailDrawer;

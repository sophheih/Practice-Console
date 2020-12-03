/* eslint-disable camelcase */

import React, { useState } from "react";
import { Button, ControlLabel, Drawer, Form, FormControl, FormGroup, HelpBlock, InputNumber, Loader, Notification, Uploader } from "rsuite";
import { FileType } from "rsuite/lib/Uploader";
import { useAPIs } from "../../../hooks/useAPIs";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { defaultService, Service } from "../../../models/definitions";

interface Props {
    isShowing: boolean;
    onCreate: () => void;
    close: () => void;
}

const ServiceCreateDrawer = (props: Props) => {
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const [service, setService] = useState<Service>(defaultService);

    const uploadImage = (img: FileType) => {
        Notification.info({
            title: "請稍候",
            description: "正在為您上傳圖片 ...",
            placement: "bottomStart",
        });
        APIs.image
            .upload(img)
            .then((res) => {
                console.log(service);
                service.image_url.push(res.url);
            })
            .catch((err) => {
                if (err !== "EMPTY_FILE") {
                    handleError(err, "發生錯誤", "上傳照片到資料庫時發生問題，請檢查主機連線狀態或聯繫技術人員");
                }
            });
        return false;
    };

    const createService = () => {
        APIs.service
            .create(service)
            .then(() => {
                props.onCreate();
                Notification.closeAll();
                props.close();
                setService(defaultService);
            })
            .catch((err) => handleError(err, "發生錯誤", "新增促銷活動資料時發生錯誤"));
    };

    const getFIleList = (images: string[]) => {
        let n = 0;
        return images.map((img) => {
            n++;
            return {
                name: img,
                fileKey: n,
                url: img,
            };
        });
    };

    return (
        <Drawer
            placement="right"
            show={props.isShowing}
            onHide={() => {
                close();
            }}
            size="lg"
        >
            <Drawer.Header>
                <Drawer.Title>服務項目 {service.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                {service ? (
                    <Form formValue={service}>
                        <Uploader
                            listType="picture"
                            defaultFileList={getFIleList(service.image_url)}
                            shouldUpload={(file) => uploadImage(file)}
                        />

                        <FormGroup>
                            <ControlLabel>服務標題</ControlLabel>
                            <FormControl
                                name="title"
                                onChange={(v) => {
                                    service.title = v;
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>短描述</ControlLabel>
                            <FormControl
                                name="short_description"
                                componentClass="textarea"
                                onChange={(v) => (service.short_description = v)}
                            />
                            <HelpBlock>在這裡輸入該服務的簡短敘述，會顯示於 App 的服務列表頁面</HelpBlock>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>長描述</ControlLabel>
                            <FormControl
                                name="long_description"
                                componentClass="textarea"
                                onChange={(v) => (service.long_description = v)}
                            />
                            <HelpBlock>在這裡輸入該服務的完整敘述，會顯示於 App 的服務詳情頁面</HelpBlock>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>所需時間</ControlLabel>
                            <FormControl name="duration" accepter={InputNumber} onChange={(v) => (service.duration = +v)} />
                            <HelpBlock>單位為分鐘</HelpBlock>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>定價</ControlLabel>
                            <FormControl prefix="$" name="price" accepter={InputNumber} onChange={(v) => (service.price = +v)} />
                            <HelpBlock>單位為新台幣</HelpBlock>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>一般會員折扣比例</ControlLabel>
                            <FormControl name="nor_per" onChange={(v) => (service.nor_per = v)} />
                            <HelpBlock>輸入 1 代表一般會員原價，輸入 0.8 代表一般會員 8 折，輸入 0.5 代表一般會員半價</HelpBlock>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>VIP 會員折扣比例</ControlLabel>
                            <FormControl name="vip_per" onChange={(v) => (service.vip_per = v)} />
                            <HelpBlock>輸入 1 代表 VIP 會員原價，輸入 0.8 代表 VIP 會員 8 折，輸入 0.5 代表 VIP 會員半價</HelpBlock>
                        </FormGroup>
                    </Form>
                ) : (
                    <Loader />
                )}
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 32 }}>
                <Button appearance="primary" onClick={() => createService()}>
                    新增服務
                </Button>
                <Button appearance="subtle" onClick={() => props.close()}>
                    關閉
                </Button>
            </Drawer.Footer>
        </Drawer>
    );
};

export default ServiceCreateDrawer;

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Icon, IconButton, Input, Notification, Row, Table } from "rsuite";
import ServiceCreateDrawer from "../components/Drawer/ServiceDrawer/ServiceCreateDrawer";
import ServiceDetailDrawer from "../components/Drawer/ServiceDrawer/ServiceDetailDrawer";
import { useAPIs } from "../hooks/useAPIs";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { Service } from "../models/definitions";

const { Column, HeaderCell, Cell } = Table;

interface RouteParams {
    serviceID: string;
}

const ServicePage = () => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const { serviceID } = useParams<RouteParams>();

    const [services, setServices] = useState<Service[] | undefined>(undefined);
    const [service, setService] = useState<Service | undefined>();
    const [keyword, setKeyword] = useState("");
    const [isCreatingService, setCreatingService] = useState(false);

    useEffect(() => {
        APIs.service
            .getAll()
            .then((res) => setServices(res))
            .catch((err) => handleError(err, "發生錯誤", "下載所有服務項目時發生錯誤，請檢查主機連線狀態或聯繫客服人員。"));
    }, [history.location.pathname]);

    useEffect(() => {
        if (serviceID && serviceID.length === 24) {
            Notification.info({
                title: "請稍候",
                description: "正在下載服務項目 " + serviceID + " 的數據 ...",
                key: "getServiceData",
                placement: "bottomStart",
            });
            APIs.service
                .getData(serviceID)
                .then((res) => setService(res))
                .catch((err) => handleError(err, "發生錯誤", "下載下載服務項目 " + serviceID + " 的數據時發生錯誤。"));
        } else {
            history.push("/service");
            setService(undefined);
        }
    }, [serviceID, history]);

    const filltedData = () => {
        if (keyword !== "") {
            return services?.filter((service) => {
                if (service.title.includes(keyword)) return true;
                if (service.short_description.includes(keyword)) return true;
                if (service.long_description.includes(keyword)) return true;
                if (service.id === keyword) return true;
            });
        } else return services;
    };

    const refresh = () => {
        APIs.service
            .getAll()
            .then((res) => setServices(res))
            .catch((err) => handleError(err, "發生錯誤", "下載所有服務項目時發生錯誤，請檢查主機連線狀態或聯繫客服人員。"));
    };

    return (
        <div className="page-container">
            <Row style={{ margin: "32px 0" }}>
                <h1>服務管理</h1>
                <p>點擊服務可以編輯資料</p>
            </Row>

            <Row style={{ marginTop: 18 }}>
                <IconButton icon={<Icon icon="plus" />} placement="right" appearance="primary" onClick={() => setCreatingService(true)}>
                    建立新服務項目
                </IconButton>
            </Row>

            <Row style={{ marginTop: 36 }}>
                <Input placeholder="使用關鍵字搜尋" value={keyword} onChange={(v) => setKeyword(v)} />
            </Row>

            <Row style={{ marginTop: 36 }}>
                <Table
                    autoHeight
                    width={960}
                    data={filltedData()}
                    onRowClick={(service) => {
                        history.push("/service/" + service.id);
                    }}
                    loading={services === undefined}
                >
                    <Column width={160}>
                        <HeaderCell>服務標題</HeaderCell>
                        <Cell dataKey="title" />
                    </Column>

                    <Column width={160}>
                        <HeaderCell>服務定價</HeaderCell>
                        <Cell>{(rowData: any) => "儲值金 " + rowData.price + " 元"}</Cell>
                    </Column>

                    <Column width={100}>
                        <HeaderCell>服務時間長度</HeaderCell>
                        <Cell>{(rowData: any) => rowData.duration + " 分鐘"}</Cell>
                    </Column>

                    <Column width={360}>
                        <HeaderCell>服務簡介</HeaderCell>
                        <Cell dataKey="short_description" />
                    </Column>
                </Table>
            </Row>

            <ServiceDetailDrawer
                service={service}
                close={() => {
                    history.push("/service");
                }}
            />

            <ServiceCreateDrawer
                isShowing={isCreatingService}
                onCreate={() => {
                    setCreatingService(false);
                    refresh();
                }}
                close={() => {
                    history.push("/service");
                }}
            />
        </div>
    );
};

export default ServicePage;

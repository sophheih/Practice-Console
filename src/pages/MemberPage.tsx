import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Icon, IconButton, Input, Notification, Row, Table } from "rsuite";
import MemberCreateDrawer from "../components/Drawer/MemberDrawer/MemberCreateDrawer";
import MemberDetailDrawer from "../components/Drawer/MemberDrawer/MemberDetailDrawer";
import { useAPIs } from "../hooks/useAPIs";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { Member } from "../models/definitions";

const { Column, HeaderCell, Cell } = Table;

interface RouteParams {
    memberID: string;
}

const MemberPage = () => {
    const history = useHistory();
    const APIs = useAPIs();
    const { handleError } = useErrorHandler();

    const { memberID } = useParams<RouteParams>();
    const [isCreatingMember, setCreatingMember] = useState(false);

    const [members, setMembers] = useState<Member[] | undefined>(undefined);
    const [member, setMember] = useState<Member | undefined>();
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        if (history.location.pathname === "/member") refresh();
    }, [history.location.pathname]);

    useEffect(() => {
        if (memberID && memberID.length == 24) {
            Notification.info({
                title: "請稍候",
                description: "正在下載會員 " + memberID + " 的數據 ...",
                key: "getMemberData",
                placement: "bottomStart",
            });
            APIs.member
                .getData(memberID)
                .then((res) => setMember(res))
                .catch((err) => {
                    handleError(err, "下載會員資料時發生錯誤", "請檢查主機狀態或聯繫技術人員處理");
                    history.push("/member/");
                });
        } else {
            history.push("/member");
            setMember(undefined);
        }
    }, [memberID, history]);

    const filltedData = () => {
        if (keyword !== "") {
            return members?.filter((member) => {
                if (member.email.includes(keyword)) return true;
                if (member.real_name.includes(keyword)) return true;
                if (member.username.includes(keyword)) return true;
                if (member.cellphone.includes(keyword)) return true;
                if (member.id === keyword) return true;
            });
        } else return members;
    };

    const refresh = () => {
        APIs.member
            .getAll()
            .then((res) => setMembers(res))
            .catch((err) => handleError(err, "發生錯誤", "下載所有會員數據時發生錯誤，請檢查主機連線或聯繫技術人員"));
    };

    return (
        <div className="page-container">
            <Row style={{ margin: "32px 0" }}>
                <h1>會員管理</h1>
                <p>點擊會員可以編輯資料</p>
            </Row>

            <Row style={{ marginTop: 18 }}>
                <IconButton icon={<Icon icon="plus" />} placement="right" appearance="primary" onClick={() => setCreatingMember(true)}>
                    手動建立會員
                </IconButton>
            </Row>

            <Row style={{ marginTop: 36 }}>
                <Input placeholder="使用關鍵字搜尋" value={keyword} onChange={(v) => setKeyword(v)} />
            </Row>

            <Row style={{ marginTop: 18 }}>
                <Table
                    width={960}
                    autoHeight
                    data={filltedData()}
                    onRowClick={(member) => {
                        history.push("/member/" + member.id);
                    }}
                    rowClassName="table-row"
                    loading={members === undefined}
                >
                    <Column width={120}>
                        <HeaderCell>會員姓名</HeaderCell>
                        <Cell dataKey="real_name" />
                    </Column>

                    <Column width={160}>
                        <HeaderCell>帳號</HeaderCell>
                        <Cell dataKey="username" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>餘額</HeaderCell>
                        <Cell>{(rowData: Member) => <p>{rowData.balance} 元</p>}</Cell>
                    </Column>

                    <Column width={90}>
                        <HeaderCell>性別</HeaderCell>
                        <Cell dataKey="gender" />
                    </Column>

                    <Column width={120}>
                        <HeaderCell>手機號碼</HeaderCell>
                        <Cell dataKey="cellphone" />
                    </Column>

                    <Column width={240}>
                        <HeaderCell>電子郵件</HeaderCell>
                        <Cell dataKey="email" />
                    </Column>
                </Table>
            </Row>

            <MemberDetailDrawer
                member={member}
                onDelete={() => {
                    refresh();
                }}
                close={() => {
                    history.push("/member");
                }}
            />

            <MemberCreateDrawer
                onClose={() => {
                    setCreatingMember(false);
                    refresh();
                }}
                isShowing={isCreatingMember}
            />
        </div>
    );
};

export default MemberPage;

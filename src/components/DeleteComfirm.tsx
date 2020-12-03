/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";
import { Button, Icon, Modal } from "rsuite";

class DeleteComfirm extends React.Component<{ content: string; onComfirm: () => void }, { show: boolean }> {
    private onComfirm: () => void;
    constructor(props: { content: string; onComfirm: () => void }) {
        super(props);
        this.state = {
            show: false,
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.confirm = this.confirm.bind(this);
        this.onComfirm = props.onComfirm;
    }

    close() {
        this.setState({ show: false });
    }

    open() {
        this.setState({ show: true });
    }

    confirm() {
        this.onComfirm();
        this.close();
    }

    render() {
        return (
            <div className="modal-container">
                <Modal backdrop="static" show={this.state.show} onHide={this.close} size="xs">
                    <Modal.Body>
                        <Icon
                            icon="remind"
                            style={{
                                color: "#ff0000",
                                fontSize: 24,
                            }}
                        />
                        {this.props.content}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.confirm} appearance="subtle">
                            確定刪除
                        </Button>
                        <Button onClick={this.close} appearance="primary">
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default DeleteComfirm;

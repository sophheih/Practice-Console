import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Col, Row } from "rsuite";
import NoTokenWarning from "./components/NoTokenWarning";
import ScreenWidthWarning from "./components/ScreenWidthWarning";
import SideNav from "./components/SideNav";
import EventRouter from "./routes/EventRouter";
import MemberRouter from "./routes/MemberRouter";
import OrderRouter from "./routes/OrderRouter";
import ReservationRouter from "./routes/ReservationRouter";
import ServiceRouter from "./routes/ServiceRouter";
import TherapistRouter from "./routes/TherapistRouter";
import "./styles/App.sass";
import "./styles/CustomRsuite.less";


const App = () => {
    return (
        <BrowserRouter>
            <ScreenWidthWarning />
            <NoTokenWarning />
            <Row>
                <Col xs={6} md={4}>
                    <Route component={SideNav} />
                </Col>
                <Col xs={18} md={20}>
                    <Switch>
                        <Route path="/reservation" component={ReservationRouter} />
                        <Route path="/member" component={MemberRouter} />
                        <Route path="/order" component={OrderRouter} />
                        <Route path="/service" component={ServiceRouter} />
                        <Route path="/event" component={EventRouter} />
                        <Route path="/therapist" component={TherapistRouter} />
                    </Switch>
                </Col>
            </Row>
        </BrowserRouter>
    );
};

export default App;

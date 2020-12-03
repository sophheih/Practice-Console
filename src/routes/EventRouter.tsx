import React from "react";
import { Route, Switch } from "react-router-dom";
import EventPage from "../pages/EventPage";

const EventRouter = () => {
    return (
        <Switch>
            <Route path="/event/:eventID" component={EventPage} />
            <Route path="/event" component={EventPage} />
        </Switch>
    );
};

export default EventRouter;

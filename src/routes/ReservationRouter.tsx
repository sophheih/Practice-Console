import React from "react";
import { Route, Switch } from "react-router-dom";
import ReservationsPage from "../pages/ReservationsPage";

const ReserveRouter = () => {
    return (
        <Switch>
            <Route path="/reservation/:reserveID" component={ReservationsPage} />
            <Route path="/reservation" component={ReservationsPage} />
        </Switch>
    );
};

export default ReserveRouter;

import React from "react";
import { Route, Switch } from "react-router-dom";
import ServicePage from "../pages/ServicePage";

const ServiceRouter = () => {
    return (
        <Switch>
            <Route path="/service/:serviceID" component={ServicePage} />
            <Route path="/service" component={ServicePage} />
        </Switch>
    );
};

export default ServiceRouter;

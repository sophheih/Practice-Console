import React from "react";
import { Route, Switch } from "react-router-dom";
import TherapistPage from "../pages/TherapistPage";

const TherapistRouter = () => {
    return (
        <Switch>
            <Route path="/therapist/:therapistID" component={TherapistPage} />
            <Route path="/therapist" component={TherapistPage} />
        </Switch>
    );
};

export default TherapistRouter;

import React from "react";
import { Route, Switch } from "react-router-dom";
import MemberPage from "../pages/MemberPage";

const MemberRouter = () => {
    return (
        <Switch>
            <Route path="/member/:memberID" component={MemberPage} />
            <Route path="/member" component={MemberPage} />
        </Switch>
    );
};

export default MemberRouter;

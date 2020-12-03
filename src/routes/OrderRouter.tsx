import React from "react";
import { Route, Switch } from "react-router-dom";
import OrderPage from "../pages/OrderPage";

const OrderRouter = () => {
    return (
        <Switch>
            <Route path="/order/:orderID" component={OrderPage} />
            <Route path="/order" component={OrderPage} />
        </Switch>
    );
};
export default OrderRouter;

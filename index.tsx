import * as React from "react";
import { render } from "react-dom";
import App from "./src/App";
import "./src/styles/index.sass";


const rootEl = document.getElementById("root");

render(<App />, rootEl);

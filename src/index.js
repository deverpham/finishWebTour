import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Intro } from "./pages/intro";
import "./styles.css";
class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact={true} path="/" component={Intro} />
        </Switch>
      </HashRouter>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

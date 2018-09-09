import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
class App extends React.Component {
  render() {
    return <div>App</div>;
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

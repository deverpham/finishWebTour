import React, { Component, Fragment } from "react";
import Logo from "../../public/images/logo.jpg";
import Lightning from "../../public/images/lightning.svg";
import "./intro.css";
import Start from "./animate_lightning";
export class Intro extends Component {
  componentDidMount() {
    //Start();
  }
  render() {
    return (
      <Fragment>
        <div className="logo shadow shadow-lg" onMouseEnter={Start}>
          <div className="intro__logo_mask" />
          <img className="img-fluid logo_avatar center_position" src={Logo} />
          <span class="dever_name">Phạm Hoàng Thịnh</span>
          <div id="svg" class="lightningSvg" />
        </div>
        <p className="intro_sologan">
          Tôi là Developer.Và đây là nơi tôi lưu trữ cuộc đời lập trình của tôi
          <br />
          Cảm ơn bạn đã quan tâm tới tôi!
        </p>
      </Fragment>
    );
  }
}

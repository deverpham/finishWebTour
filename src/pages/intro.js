import React, { Component, Fragment } from "react";
import Logo from "../../public/images/logo.jpg";
import "./intro.css";
export class Intro extends Component {
  render() {
    return (
      <Fragment>
        <div className="logo shadow shadow-lg">
          <img className="img-fluid logo_avatar center_position" src={Logo} />
          <span class="dever_name">Phạm Hoàng Thịnh</span>
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

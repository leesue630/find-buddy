import React, { Component } from "react";

class InfoCard extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.andrewID}</h1>
        <h1>{this.props.name}</h1>
      </div>
    );
  }
}

export default InfoCard;

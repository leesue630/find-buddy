import React, { Component } from "react";

class InfoCard extends Component {
  render() {
    return (
      <div>
        <h1>Andrew ID: {this.props.andrewID}</h1>
        <h1>Name: {this.props.name}</h1>
        <h1>
          Searching:{" "}
          {this.props.searching !== undefined
            ? this.props.searching.toString()
            : ""}
        </h1>
      </div>
    );
  }
}

export default InfoCard;

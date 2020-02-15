import React, { Component } from "react";
import LocationDropdown from "./locationDropdown";

class RequestDiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dest: this.props.choices[0],
      timeBy: this.getCurrTime()
    };
    this.handleDestChange = this.handleDestChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  handleDestChange = l => {
    console.log("dest changed to:" + l);
    this.setState({ dest: l });
  };

  handleTimeChange = t => {
    console.log("time changed to:" + t);
    this.setState({ timeBy: t });
  };

  getCurrTime = () => {
    var date = new Date();
    var hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var str = hours + ":" + minutes;
    console.log(str);
    return str;
  };

  render() {
    return (
      <div>
        Destination:{" "}
        <LocationDropdown
          dropdownName="dest"
          choices={this.props.choices}
          onChange={this.handleDestChange}
        />
        <br />
        Leave By:{" "}
        <input
          type="time"
          id="timeInput"
          width="100px"
          className="form-control"
          value={this.state.timeBy}
          onChange={e => this.handleTimeChange(e.target.value)}
        />
        <button
          onClick={() =>
            this.props.onRequest(this.state.dest, this.state.timeBy)
          }
          className="btn btn-primary btn-sm m-2"
        >
          {!this.props.searching ? "Request Buddy" : "Try Again"}
        </button>
        {this.props.searching ? (
          <button
            onClick={() => this.props.onCancel()}
            className="btn btn-primary btn-sm m-2"
          >
            Cancel Request
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default RequestDiv;

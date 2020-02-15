import React, { Component } from "react";

class RequestBtn extends Component {
  state = {
    dest: "",
    timeBy: ""
  };

  handleDestChange = l => {
    console.log("dest cahnged to:" + l);
    this.setState({ dest: l });
  };

  handleTimeChange = t => {
    console.log("time changed to:" + t);
    this.setState({ timeBy: t });
  };

  render() {
    return (
      <div>
        Destination:
        <select
          id="destSelect"
          name="destSelect"
          onChange={e =>
            this.handleDestChange(this.props.locChoices[e.target.selectedIndex])
          }
        >
          {this.props.locChoices.map(l => (
            <option key={l + "loc"} value={l}>
              {l}
            </option>
          ))}
        </select>
        <br />
        Leave By:{" "}
        <input
          type="text"
          id="timeInput"
          onChange={e => this.handleTimeChange(e.target.value)}
        />
        <button
          onClick={() =>
            this.props.onRequest(this.state.dest, this.state.timeBy)
          }
          className="btn btn-primary btn-sm m-2"
        >
          Request Buddy
        </button>
      </div>
    );
  }
}

export default RequestBtn;

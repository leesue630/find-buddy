import React, { Component } from "react";

class CurrLocation extends Component {
  state = {
    loc: ""
  };

  render() {
    return (
      <div>
        Current Location:
        <select
          id="locSelect"
          onChange={e =>
            this.props.onChangeLoc(
              this.props.locChoices[e.target.selectedIndex]
            )
          }
        >
          {this.props.locChoices.map(l => (
            <option key={l + "loc"} value={l}>
              {l}
            </option>
          ))}
        </select>
        <br />
      </div>
    );
  }
}

export default CurrLocation;

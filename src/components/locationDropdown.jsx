import React, { Component } from "react";

class LocationDropdown extends Component {
  constructor(props) {
    super(props);
    var setLoc = this.props.setLoc;
    var initLoc;
    if (typeof setLoc !== undefined) {
      initLoc = setLoc;
    } else {
      initLoc = this.props.choices[0];
      this.props.onChange(this.state.initLoc);
    }
    this.state = {
      selectedLoc: initLoc
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = e => {
    this.setState({ selectedLoc: this.props.choices[e.target.selectedIndex] });
    this.props.onChange(this.state.selectedLoc);
  };

  render() {
    return (
      <select
        id={this.props.name + "_locDropdown"}
        onChange={e => this.handleChange(e)}
      >
        {this.props.choices.map(l => {
          if (l === this.props.setLoc) {
            return (
              <option selected key={this.props.name + "_" + l} value={l}>
                {l}
              </option>
            );
          }
          return (
            <option key={this.props.name + "_" + l} value={l}>
              {l}
            </option>
          );
        })}
      </select>
    );
  }
}

export default LocationDropdown;

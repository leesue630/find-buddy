import React, { Component } from "react";

class Counter extends Component {
  //   state = {
  //     value: this.props.counter.value,
  //     tags: ["tag1", "tag2", "tag3"]
  //     // tags: []
  //   };

  //   constructor() {
  //     super();
  //     this.handleIncrement = this.handleIncrement.bind(this);
  //   }

  // making function into function w/ argument fixes bind issue
  //   handleIncrement = () => {
  // this.state.count++; doesn't update the DOM. instead do:
  // this.setState({ value: this.state.value + 1 });
  // obj.method(); if this is called as part of a method in an object,
  // this will always be a reference to that object
  // function(); if the function is called as a standalone function
  // without an object reference, this, by default, returns a reference
  // to the window object. if strict mode is enabled, it will return undefined.
  //   };

  //   renderTags() {
  //     if (this.state.tags.length === 0) {
  //       return <p>There are no tags.</p>;
  //     }
  //     return (
  //       <ul>
  //         {this.state.tags.map(tag => (
  //           <li key={tag}>{tag}</li>
  //         ))}
  //       </ul>
  //     );
  //   }

  componentDidUpdate(prevprops, prevstate) {
    // decide whether to do ajax call or not
  }

  componentWillUnmount() {
    // called before component removed from DOM
  }

  render() {
    return (
      <div>
        {this.props.children}
        <span className={this.getBadgeClasses()}>{this.formatCount()}</span>
        <button
          onClick={() => this.props.onIncrement(this.props.counter)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
        <button
          onClick={() => this.props.onDelete(this.props.counter.id)}
          className="btn btn-danger btn-secondary btn-sm m-2"
        >
          Delete
        </button>
        {/* {this.state.tags.length === 0 && "Please put more tags."} */}
        {/* {this.renderTags()} */}
      </div>
    );
  }

  getBadgeClasses() {
    let classes = "badge m-2 badge-";
    classes += this.props.counter.value === 0 ? "warning" : "primary";
    return classes;
  }

  formatCount() {
    const { value } = this.props.counter;
    return value === 0 ? "Zero" : value;
  }
}

export default Counter;

import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

class Login extends Component {
  state = {
    andrewID: "",
    password: ""
  };
  routing = (
    <Router>
      <div>
        <Route
          exact
          path="/"
          component={App({ andrewID: this.andrewID, password: this.password })}
        />
      </div>
    </Router>
  );

  handleAndrewChange = andID => {
    console.log("andrewID: " + andID);
    this.setState({ andrewID: andID });
  };

  handlePassChange = psw => {
    console.log("password: " + psw);
    this.setState({ password: psw });
  };

  handleLogin = () => {
    const app = Stitch.defaultAppClient;
    const credential = new UserPasswordCredential(
      this.state.andrewID + "@andrew.cmu.edu",
      this.state.password
    );
    app.auth
      .loginWithCredential(credential)
      // Returns a promise that resolves to the authenticated user
      .then(authedUser => {
        console.log(`successfully logged in with id: ${authedUser.id}`);
        window.location.href = "/";
      })
      .catch(err => console.error(`login failed with error: ${err}`));
  };

  render() {
    return (
      <div>
        <label for="andrewID">
          <b>Andrew ID</b>
        </label>
        <input
          type="text"
          placeholder="Enter Andrew ID"
          name="andrewID"
          onChange={() => this.handleAndrewChange()}
          required
        />

        <label for="psw">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          onChange={() => this.handlePassChange()}
          required
        />

        <button type="submit" onClick={() => this.handleLogin()}>
          Login
        </button>
        {this.routing}
      </div>
    );
  }
}

export default Login;

import React, { Component } from "react";
// import logo from "./logo.svg";
import CurrLocation from "./components/currLocation";
import "./App.css";
import InfoCard from "./components/infoCard";
import RequestBtn from "./components/requestBtn";
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

class App extends Component {
  locationChoices = ["Doherty", "Gates", "Fairfax"];

  constructor(props) {
    super(props);
    this.state = {
      id: "123",
      currLocation: "",
      searching: false,
      user: {
        andrewID: "nwai"
      },
      searchers: [],
      value: "",
      db: null
    };
    this.displaySearchers = this.displaySearchers.bind(this);
    this.handleRequestBuddy = this.handleRequestBuddy.bind(this);
    this.handleCurrLocChange = this.handleCurrLocChange.bind(this);
  }

  componentDidMount() {
    // Initialize the App Client
    this.client = Stitch.initializeDefaultAppClient("findbuddy-bpwvk");
    // Get a MongoDB Service Client
    // This is used for logging in and communicating with Stitch
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    // Get a reference to the todo database
    console.log("App Mounted");
    var dbnew = mongodb.db("searching");
    this.setState({ db: dbnew });
    // this.state.db = mongodb.db("searching");
    this.displaySearchersOnLoad();
  }

  displaySearchers() {
    // query the remote DB and update the component state
    console.log("displaySearchers called");
    console.log(this.state.db);
    console.log("hi");
    this.state.db
      .collection("searcher")
      .find({}, { limit: 1000 })
      .asArray()
      .then(searchers => {
        this.setState({ searchers });
      });
  }
  displaySearchersOnLoad() {
    // Anonymously log in and display comments on load
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displaySearchers)
      .catch(console.error);
  }

  handleRequestBuddy = (dest, timeBy) => {
    console.log(this.state.currLocation + ", " + dest + ", " + timeBy);
    this.client
      .callFunction("addSearchingUser", [
        this.state.user.andrewID,
        this.state.currLocation,
        dest
      ])
      .then(result => this.displaySearchers)
      .catch(console.error);
    this.setState({ searching: true });
    this.client
      .callFunction("getBuddy", [
        {
          andrewID: this.state.user.andrewID,
          currLocation: this.state.currLocation,
          destination: dest
        }
      ])
      .then((caller, buddy) => console.log(caller + ", " + buddy))
      .catch(console.error);
  };

  handleCurrLocChange = loc => {
    console.log("location changed to:" + loc);
    this.setState({ currLocation: loc });
  };

  render() {
    return (
      <React.Fragment>
        <InfoCard andrewID={this.state.user.andrewID} />
        <CurrLocation
          loc={this.state.currLocation}
          locChoices={this.locationChoices}
          onChangeLoc={this.handleCurrLocChange}
        />
        <RequestBtn
          locChoices={this.locationChoices}
          onRequest={this.handleRequestBuddy}
        />
        <ul>
          {this.state.searchers.map(searcher => {
            return (
              <li key={searcher.owner_id}>
                {searcher.andrewID},{searcher.destination}
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }
}

export default App;

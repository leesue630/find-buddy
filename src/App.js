import React, { Component } from "react";
// import logo from "./logo.svg";
import LocationDropdown from "./components/locationDropdown";
import "./App.css";
import InfoCard from "./components/infoCard";
import RequestDiv from "./components/requestDiv";
import {
  Stitch,
  AnonymousCredential,
  UserPasswordCredential,
  RemoteMongoClient,
  UserPasswordAuthProviderClient
} from "mongodb-stitch-browser-sdk";

class App extends Component {
  locationChoices = ["Doherty", "Gates", "Fairfax"];

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      user: {
        andrewID: "nwai",
        name: ""
      },
      searchers: []
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
    this.dbSearching = mongodb.db("searching");
    this.dbUser = mongodb.db("user");
    this.displayOnLoad();
    this.updateUserDisplay();
  }

  updateUserDisplay() {
    const query = { "buddies.andrewID": this.state.andrewID };
    const options = {
      limit: 1
    };
    this.dbUser
      .collection("buddies")
      .findOne(query, options)
      .then(buddy => {
        if (buddy) {
          console.log(`Successfully found document: ${buddy}.`);
          this.state.user.name = buddy.name;
        } else {
          console.log("No document matches the provided query.");
        }
      })
      .catch(console.error);
  }

  displaySearchers() {
    // query the remote DB and update the component state
    console.log("displaySearchers called");
    console.log(this.dbSearching);
    console.log("hi");
    this.dbSearching
      .collection("searcher")
      .find({}, { limit: 1000 })
      .asArray()
      .then(searchers => {
        this.setState({ searchers });
      })
      .catch(console.error);
  }

  displayOnLoad() {
    // Anonymously log in and display comments on load
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() => {
        this.displaySearchers();
        this.updateUserDisplay();
      })
      .catch(console.error);

    // const credential = new UserPasswordCredential(
    //   this.state.andrewID + "@andrew.cmu.edu",
    //   this.props.password
    // );
    // this.client.auth
    //   .loginWithCredential(credential)
    //   // Returns a promise that resolves to the authenticated user
    //   .then(authedUser => {
    //     console.log(`successfully logged in with id: ${authedUser.id}`);
    //     this.displaySearchers();
    //     this.updateUserDisplay();
    //   })
    //   .catch(err => console.error(`login failed with error: ${err}`));
  }

  getBuddy = (dest, timeBy) => {
    // GET BUDDY FUNCTION GOES HERE
    this.dbSearching
      .collection("searcher")
      .insertOne({
        andrewID: this.state.user.andrewID,
        currLocation: this.state.currLocation,
        destination: dest
      })
      .then(() => {
        this.displaySearchers();
        // this.getBuddy(dest, timeBy);
      });
  };

  addRequest = (dest, timeBy) => {
    // ADD THE ADD TO SEARCHING FUNCTION HERE
  };

  handleRequestBuddy = (dest, timeBy) => {
    console.log(
      "handleRequestBuddy: " +
        this.state.currLocation +
        ", " +
        dest +
        ", " +
        timeBy
    );
    if (!this.state.searching) {
      this.addRequest(dest, timeBy);
      this.setState({ searching: true });
    }
    this.getBuddy(dest, timeBy);
  };

  handleCurrLocChange = loc => {
    console.log("location changed to: " + loc);
    this.setState({ currLocation: loc });
  };

  render() {
    return (
      <React.Fragment>
        <InfoCard
          andrewID={this.state.user.andrewID}
          name={this.state.user.name}
        />
        Current:{" "}
        <LocationDropdown
          setLoc={this.state.currLocation}
          dropdownName="curr"
          choices={this.locationChoices}
          onChange={this.handleCurrLocChange}
        />
        <RequestDiv
          choices={this.locationChoices}
          onRequest={this.handleRequestBuddy}
        />
        <ul>
          {this.state.searchers.map(searcher => {
            return (
              <li key={searcher.owner_id}>
                Andrew ID: {searcher.andrewID}, Start: {searcher.currLocation},
                Destination: {searcher.destination}
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }
}

export default App;

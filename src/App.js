import React, { Component } from "react";
// import logo from "./logo.svg";
import LocationDropdown from "./components/locationDropdown";
import "./App.css";
import InfoCard from "./components/infoCard";
import RequestDiv from "./components/requestDiv";
import {
  Stitch,
  AnonymousCredential,
  // UserPasswordCredential,
  RemoteMongoClient
  // BSON,
  // UserPasswordAuthProviderClient
} from "mongodb-stitch-browser-sdk";

class App extends Component {
  locationChoices = ["Doherty", "Gates", "Fairfax"];

  constructor(props) {
    super(props);
    this.state = {
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
    this.getUserInfo();
  }

  getUserInfo() {
    var query = { "buddies.andrewID": this.state.andrewID };
    const options = {
      limit: 1
    };
    this.dbUser
      .collection("buddies")
      .findOne(query, options)
      .then(buddy => {
        if (buddy) {
          console.log(`User found: ${buddy}.`);
          this.state.user.name = buddy.name;
        } else {
          console.log("No user found.");
        }
      })
      .catch(console.error);
    var query = { "searcher.andrewID": this.state.andrewID };
    this.dbSearching
      .collection("searcher")
      .findOne(query, options)
      .then(searcher => {
        if (searcher) {
          console.log(`Existing request found: ${searcher}.`);
          this.state.searching = true;
        } else {
          console.log("No existing request.");
          this.state.searching = true;
        }
      })
      .catch(console.error);
    this.state.currLocation = this.locationChoices[0];
  }

  displaySearchers() {
    // query the remote DB and update the component state
    console.log("displaySearchers called");
    console.log(this.dbSearching);
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
        this.getUserInfo();
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
    //     this.getUserInfo();
    //   })
    //   .catch(err => console.error(`login failed with error: ${err}`));
  }

  getBuddy = (dest, timeBy) => {
    // GET BUDDY FUNCTION GOES HERE
    const query = {
      $and: [
        { destination: { $eq: dest } },
        { currLocation: { $eq: this.state.currLocation } },
        { timeBy: { $eq: timeBy } }
      ]
    };
    const options = {
      limit: 1
    };
    this.dbSearching
      .collection("searcher")
      .findOne(query, options)
      .then(buddy => {
        if (buddy) {
          console.log(`Successfully found a buddy: ${buddy.name}`);
        } else {
          console.log("No buddy found.");
        }
      })
      .catch(console.error);
  };

  addRequest = (dest, timeBy) => {
    this.dbSearching
      .collection("searcher")
      .insertOne({
        andrewID: this.state.user.andrewID,
        currLocation: this.state.currLocation,
        destination: dest,
        timeBy: timeBy
      })
      .then(() => {
        this.displaySearchers();
        // this.getBuddy(dest, timeBy);
      });
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

  handleCancelRequest = () => {
    console.log("Cancel request");
    const query = { andrewID: this.state.user.andrewID };
    this.dbSearching
      .collection("searcher")
      .deleteOne(query)
      .then(result => {
        console.log(`Deleted ${result.deletedCount} item.`);
        this.displaySearchers();
      })
      .catch(err => console.error(`Delete failed with error: ${err}`));
    this.setState({ searching: false });
  };

  render() {
    return (
      <React.Fragment>
        <InfoCard
          andrewID={this.state.user.andrewID}
          searching={this.state.searching}
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
          searching={this.state.searching}
          choices={this.locationChoices}
          onRequest={this.handleRequestBuddy}
          onCancel={this.handleCancelRequest}
        />
        <ul>
          {this.state.searchers.map(searcher => {
            return (
              <li key={searcher.owner_id}>
                Andrew ID: {searcher.andrewID}, Request: {searcher.currLocation}{" "}
                -> {searcher.destination}
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }
}

export default App;

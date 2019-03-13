/*global google*/
import React, { Component } from "react";
import Map from "./MapContainer";
import { slide as Menu } from "react-burger-menu";
import SidebarSearch from "./SidebarSearch";
import ErrorBoundary from "./ErrorBoundary";
import "./App.css";


  var foursquare = require("react-foursquare")({
  clientID: "YXOHYK4SXRTDPPFVU5AGRE3OS2P5IPQTCLCXSXTHKTCHFYRW",
  clientSecret: "YMSLLPRSPAHAAPMJB1FDBF5LQXUMXK0BEOFPKQFPCZHPJZN4"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location:"New York, NY",
      food:"Tea Shops",
      items: [],
      markers: [],
      center: [],
      zoom: 13,
      updateSuperState: obj => {
        this.setState(obj);
      }
    };
  }
  // Pulls info from Foursquare API

  componentDidMount() {
    foursquare.venues
      .getVenues({
          near: this.state.location,
          query: this.state.food,
          limit:10
        }).then(res => {
        const { center } = res.response.geocode.feature.geometry;
        const markers = res.response.venues.map(venue => {
          return {
            lat: venue.location.lat,
            lng: venue.location.lng,
            title: venue.name,
            isOpen: false,
            isVisible: true,
            id: venue.id,
            name: venue.name,
            address: venue.location.address,
            crossStreet: venue.location.crossStreet,
            state_and_zip: venue.location.formattedAddress[1]
          };
        });
        this.setState({ items: res.response.venues, markers, center });
        console.log(res.response)
      })
      .catch(error => {
        window.alert("Error getting data from FourSquare. " + error.message);
        console.log(error);
      });
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.food != this.state.food || prevState.location != this.state.location){
       console.log(`Update ${this.state.food} and ${this.state.location}`);
       foursquare.venues
        .getVenues({
          near: this.state.location,
          query: this.state.food,
          limit:10
        }).then(res => {
        const { center } = res.response.geocode.feature.geometry;
        const markers = res.response.venues.map(venue => {
          return {
            lat: venue.location.lat,
            lng: venue.location.lng,
            title: venue.name,
            isOpen: false,
            isVisible: true,
            id: venue.id,
            name: venue.name,
            address: venue.location.address,
            crossStreet: venue.location.crossStreet,
            state_and_zip: venue.location.formattedAddress[1]
          };
        });
        this.setState({ items: res.response.venues, markers, center });
      })
      .catch(error => {
        window.alert("Error getting data from FourSquare. " + error.message);
        console.log(error);
      });

     }
  }
  // Closes All Open Markers
  closeAllMarkers = () => {
    const markers = this.state.markers.map(marker => {
      marker.isOpen = false;
      return marker;
    });
    this.setState({ markers: Object.assign(this.state.markers, markers) });
  };

  handleMarkerClick = marker => {
    this.closeAllMarkers();
    marker.isOpen = true;
    this.setState({ markers: Object.assign(this.state.markers, marker) });
    const item = this.state.items.find(item => item.id === marker.id);
    item.animation = 1;
    marker.animation = 1;
    foursquare.venues.getVenues({
          near: this.location,
          query: this.food,
          limit:10
        }).then(res => {
      const newVenue = Object.assign(item, res.response.venue);
      this.setState({ items: Object.assign(this.state.items, newVenue) });
    });
  };
  //Shows marker of item clicked on the list of locations.
  handleListItemClick = item => {
    const marker = this.state.markers.find(marker => marker.id === item.id);
    this.handleMarkerClick(marker);
    console.log(marker);
  };
  handleFoodButtonClick =event=> {
    console.log(event.target.value),
    this.setState({...this.state, food: event.target.value})
  };
  handleLocationButtonClick =event=> {
    console.log(event.target.value),
    this.setState({...this.state, location: event.target.value})
  };

  render() {
    return (
      <div>
        <header id="title">
          <h1>Welcome to the Neighborhood Map</h1>
          <h2>This map shows {this.state.food} in {this.state.location}</h2>
          <br />
          <div>
            <button className="button" value="Restaurant" onClick={this.handleFoodButtonClick}>Restaurant</button>
            <button className="red button" value="Study Spot" onClick={this.handleFoodButtonClick}>Study Spot</button>
            <button className="green button" value="Dessert" onClick={this.handleFoodButtonClick}>Dessert</button>
            <button className="blue button" value="Tea Shops" onClick={this.handleFoodButtonClick}>Tea Shops</button>
          </div>
          <br/>
          <div>
            <button className="gold button" value="New York, NY" onClick={this.handleLocationButtonClick}>New York</button>
            <button className="purple button" value="Taipei" onClick={this.handleLocationButtonClick}>Taipei</button>
            <button className="orange button" value="San Francisco, CA" onClick={this.handleLocationButtonClick}>San Francisco</button>
            <button className="pink button" value="Miami, FL" onClick={this.handleLocationButtonClick}>Miami</button>
          </div>
        </header>


      <div className="App" role="main">
        <ErrorBoundary>
          <Menu width={"300"}>
            <SidebarSearch
              {...this.state}
              handleListItemClick={this.handleListItemClick}
            />
          </Menu>

          <Map
            aria-label="Map"
            {...this.state}
            handleMarkerClick={this.handleMarkerClick}
          />
        </ErrorBoundary>
      </div>
    </div>
    );
  }
}

export default App;

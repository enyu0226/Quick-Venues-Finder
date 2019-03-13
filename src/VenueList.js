import React, { Component } from "react";
import ListItem from "./ListItem";
export default class VenueList extends Component {
  render() {
    console.log(item)
    return (
      <ol className="venueList">
{this.state.items.map(item=> { return <div key={item.id}>{item.name}</div>})}
      </ol>
    );
  }
}

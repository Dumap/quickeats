import React, { Component } from "react";

class RestoCard extends Component {
  render() {
    return (
      <div>
          <div>Name: {this.props.resto.name}</div>
          <div>ID: {this.props.resto.place_id}</div>
      </div>
    );
  }
}

export default RestoCard;

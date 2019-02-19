import React, { Component } from "react";

class RestoCard extends Component {
  render() {
    return (
      <div>
          <div>Name: {this.props.resto.name}</div>
          <div>ID: {this.props.resto.id}</div>
      </div>
    );
  }
}

export default RestoCard;

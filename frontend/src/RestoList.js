import React, { Component } from "react";
import RestoCard from "./RestoCard";

class RestoList extends Component {
  constructor() {
    super();
    this.state = {
      restos: null
    };
  }
  componentDidMount = () => {
    console.log("in restolist", this.props.cor)
    // let location = {lat: '45.5017156', lng: '-73.5728669'}
    // let radius = 5000
    // let body = { username, review, rating };
    fetch("/nearby")
      .then(response => response.text())
      .then(response => {
          //console.log(response)
        let parsedResponse = JSON.parse(response);
        if (parsedResponse.status) {
          this.setState({ restos: parsedResponse.restos });
        }
      })
      .catch(err => console.log("ERROR",err));
  };
  renderRestoList = (resto, index) => {
    return (
      <RestoCard 
        key={resto.place_id}
        resto={resto}
      />
    );
  };
  render() {
    return (
      <div>
        {this.state.restos
          ? this.state.restos.map(this.renderRestoList)
          : "loading restorants"}
      </div>
    );
  }
}

export default RestoList;

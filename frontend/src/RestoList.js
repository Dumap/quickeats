import React, { Component } from "react";
import { connect } from "react-redux";
import RestoCard from "./RestoCard";

class RestoList extends Component {
  constructor() {
    super();
    this.state = {
      lat: '45.5017156',
      lng: '-73.5728669',
    }
  }
  getMyLocation = () =>{
    const location = window.navigator && window.navigator.geolocation
    
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      }, (error) => {
        this.setState({ lat: 'err-latitude', lng: 'err-longitude' })
      })
    }

  }
  componentDidMount = () => {
    this.getMyLocation()
    console.log("in restolist", this.state)
    // let location = {lat: '45.5017156', lng: '-73.5728669'}
    // let radius = 5000
    // let body = { username, review, rating };
    fetch("/nearby")
      .then(response => response.text())
      .then(response => {
          //console.log(response)
        let parsedResponse = JSON.parse(response);
        if (parsedResponse.status) {
          //this.setState({ restos: parsedResponse.restos });
          this.props.dispatch({
            type: "set-resto-list",
            content: parsedResponse.restos
          });
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
        {this.props.restos
          ? this.props.restos.map(this.renderRestoList)
          : "loading restorants"}
      </div>
    );
  }
}

let mapStateToProps = function(state) {
  return {
    restos: state.restos
  };
};

let connectRestoList = connect(mapStateToProps)(RestoList);

export default connectRestoList;


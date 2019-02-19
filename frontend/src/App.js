import React, { Component } from 'react';
import RestoList from "./RestoList";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import './App.css';

class App extends Component {
  constructor() {
    super()

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
  renderRestos = () => {
    this.getMyLocation();
    console.log("in render", this.state)
    return <RestoList cor={this.state}/>;
  }
  
  render() {
    //console.log(this.state)
    return (
      <BrowserRouter>
        <div className="App">
          <div onClick={this.renderRestos} >Where Can I eat?</div>
        </div>
      </BrowserRouter>
    );
  }
}

let mapStateToProps = function(state) {
  return {
    restos: state.restos
  };
};

let connectApp = connect(mapStateToProps)(App);

export default connectApp;


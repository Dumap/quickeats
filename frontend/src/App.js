import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import './App.css';
import RestoListGo from "./RestoListGo";
import RestoListZo from "./RestoListZo";
import StartBtns from './StartBtns';
import NavAppBar from './NavAppBar';

class App extends Component {

  getMyLocation = () =>{
    console.log("getting location")
    const location = window.navigator && window.navigator.geolocation
    
    if (location) {
      location.getCurrentPosition((position) => {
        console.log("latitude", position.coords.latitude)
        console.log("latitude", position.coords.longitude)
        this.props.dispatch({
            type: "set-location",
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
      }, (error) => {
        this.setState({ lat: 'err-latitude', lng: 'err-longitude' })
      })
    }
  }
  renderRestosGo = () => {
    console.log("in renderRestosGo")
    return <RestoListGo />;
  }
  renderRestosZo = () => {
    console.log("in renderRestosZo")
    return <RestoListZo />;
  }
  renderStartButtons = () => {
    console.log("in renderStartButtons")
    return <StartBtns />;
  }
  componentDidMount = () => {
    this.getMyLocation();
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavAppBar />
          <div className="App">
            <Route exact={true} path="/" render={this.renderStartButtons} />
            <Route exact={true} path="/golist" render={this.renderRestosGo} />
            <Route exact={true} path="/zolist" render={this.renderRestosZo} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

let mapStateToProps = function(state) {
  return {
    lat: state.lat,
    lng: state.lng,
    restos: state.restos
  };
};

let connectApp = connect(mapStateToProps)(App);

export default connectApp;



import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import './App.css';
import RestoList from "./RestoList";
import StartBtns from './StartBtns';

class App extends Component {
  renderRestos = () => {
    console.log("in renderRestos")
    return <RestoList />;
  }
  renderStartButtons = () => {
    console.log("in renderStartButtons")
    return <StartBtns />;
  };
  
  render() {
    //console.log(this.state)
    return (
      <BrowserRouter>
        <div className="App">
        <Route exact={true} path="/" render={this.renderStartButtons} />
        <Route exact={true} path="/golist" render={this.renderRestos} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;


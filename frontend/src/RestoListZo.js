import React, { Component } from "react";
import { connect } from "react-redux";
import RestoCard from "./RestoCardZo";

class RestoListZo extends Component {
  
  componentDidMount = () => {
    console.log("in restolist zomato")
    console.log("latitude", this.props.lat)
    console.log("longitude", this.props.lng)
    let body = { lat: this.props.lat,
                 lon: this.props.lng,
                 radius: 100,
                 count: 20
                }
    fetch("/nearbyzo", {
      method: "POST",
      body: JSON.stringify(body)
    }).then(response => response.text())
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
        key={resto.id}
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
    lat: state.lat,
    lng: state.lng,
    restos: state.restos
  };
};

let connectRestoListZo = connect(mapStateToProps)(RestoListZo);

export default connectRestoListZo;


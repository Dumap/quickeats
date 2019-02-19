import React, { Component } from "react";
import { connect } from "react-redux";
import RestoCard from "./RestoCardGo";

class RestoListGo extends Component {
  
  componentDidMount = () => {
    console.log("in restolist")
    console.log("latitude", this.props.lat)
    console.log("latitude", this.props.lng)
    let locArray = [this.props.lat, this.props.lng];
    let body = { location: locArray,
                  radius: 1000,
                  type: 'restaurant',
                  rankby: 'prominence' 
                }
    fetch("/nearbygo", {
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
    lat: state.lat,
    lng: state.lng,
    restos: state.restos
  };
};

let connectRestoListGo = connect(mapStateToProps)(RestoListGo);

export default connectRestoListGo;


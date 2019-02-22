/*global google*/

import React, { Component } from "react";
import  { compose, withProps, lifecycle } from 'recompose'
import { connect } from "react-redux";
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps'

class Map extends Component {

      render() {
        console.log("your cors 1:", this.props.lat + " - " + this.props.lng)
        console.log("dest cors 1:", this.props.rlat + " - " + this.props.rlng)
        const DirectionsComponent = compose(
          withProps({
            googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAG8-zlUDe9RBGIPhO6BErIzH7qznXFkg8", 
            loadingElement: <div style={{ height: `400px` }} />,
            containerElement: <div style={{ width: `100%` }} />,
            mapElement: <div style={{height: `400px`, width: `100%` }}  />,
          }),
          withScriptjs,
          withGoogleMap,
          lifecycle({
            componentDidMount() { 
              console.log("your cors", this.props.lat + " - " + this.props.lng)
              console.log("dest cors", this.props.rlat + " - " + this.props.rlng)
              let home = { "lat" : this.props.lat , "lng" : this.props.lng };
              let dest = { "lat" : this.props.rlat , "lng" : this.props.rlng };
              const DirectionsService = new google.maps.DirectionsService();
              DirectionsService.route({
                origin: new google.maps.LatLng(home),
                destination: new google.maps.LatLng(dest),
                travelMode: google.maps.TravelMode.WALKING,
              }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: {...result},
                        markers: true
                    })
                } else {
                  console.error(`error fetching directions ${status}`);
                }
              });
            }
          })
        )(props =>
          <GoogleMap defaultZoom={3}>
            {props.directions && <DirectionsRenderer directions={props.directions} suppressMarkers={props.markers}/>}
          </GoogleMap>
        );
    return (<DirectionsComponent 
              lat={this.props.lat}
              lng={this.props.lng}
              rlat={this.props.rlat}
              rlng={this.props.rlng}
            />)
  }
}

let mapStateToProps = function(state) {
    return {
      lat: state.lat,
      lng: state.lng,
      newSearch: state.lng,
      restos: state.restos
    };
  };

let connectMap = connect(mapStateToProps)(Map);
export default connectMap



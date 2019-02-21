/*global google*/

import React, { Component } from "react";
import  { compose, withProps, lifecycle } from 'recompose'
import { connect } from "react-redux";
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps'

class Map extends Component {

      render() {
        const DirectionsComponent = compose(
          withProps({
            googleMapURL: "https://maps.googleapis.com/maps/api/js", 
            loadingElement: <div style={{ height: `400px` }} />,
            containerElement: <div style={{ width: `100%` }} />,
            mapElement: <div style={{height: `400px`, width: `100%` }}  />,
          }),
          withScriptjs,
          withGoogleMap,
          lifecycle({
            componentDidMount() { 
              const DirectionsService = new google.maps.DirectionsService();
              DirectionsService.route({
                origin: new google.maps.LatLng(this.props.lat, this.props.lng),
                destination: new google.maps.LatLng(this.props.rlat, this.props.rlng),
                travelMode: google.maps.TravelMode.WALKING,
              }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: {...result},
                        markers: true
                    })
                } else {
                  console.error(`error fetching directions ${result}`);
                }
              });
            }
          })
        )(props =>
          <GoogleMap
            defaultZoom={3}
          >
            {props.directions && <DirectionsRenderer directions={props.directions} suppressMarkers={props.markers}/>}
          </GoogleMap>
        );
    return (<DirectionsComponent />)
      }
 
}

let mapStateToProps = function(state) {
    return {
      lat: state.lat,
      lng: state.lng,
      restos: state.restos
    };
  };

let connectMap = connect(mapStateToProps)(Map);
export default connectMap



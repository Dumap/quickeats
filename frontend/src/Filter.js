import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

const styles = {}

class Filter extends Component {
    render() {
        return (<div></div>)
    }
}

Filter.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  let mapStateToProps = function(state) {
    return {
      lat: state.lat,
      lng: state.lng,
      newSearch: state.newSearch,
      restos: state.restos
    };
  };
  
  
  let connectFilter = connect(mapStateToProps)(Filter);
  
  export default  compose(withStyles(styles))(withRouter(connectFilter));
    


import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

const styles = {
  startScreen: {
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#191d20',
    maxWidth: '400px',
    width: '75%',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'orange',
    transition: '0.3s',
    borderRadius: '10px' 
  },
  sslogotxt: {
    marginTop: '10px',
    width: '200px',
  },
  sslogopic: {
    width: '100px',
    marginTop: '40px'
  },
  
};

class StartBtns extends Component {

  goToFilter = () => {
    this.props.dispatch({
      type: "set-search-flg",
      content: true
    });
    this.props.history.push("/filter")
  }

  goToList = () => {
    this.props.dispatch({
      type: "set-search-flg",
      content: true
    });
    this.props.history.push("/golist")
  }

  render() {
    return (
      <div className={this.props.classes.startScreen}>
        <img className={this.props.classes.sslogopic} src="logo.png" alt="Quickest" />
        <img className={this.props.classes.sslogotxt} src="qelogo.png" alt="Quickest" />
        <button 
            className="filterbutton" 
            onClick={this.goToFilter}
            >Set filters
       </button>
        <button 
            className="defautlebutton"  
            onClick={this.goToList}
            >Use defaults
        </button>
      </div>
    );
  }
}

StartBtns.propTypes = {
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


let connectStartBtns = connect(mapStateToProps)(StartBtns);

export default  compose(withStyles(styles))(withRouter(connectStartBtns));
  
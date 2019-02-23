import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import FilterListIcon from '@material-ui/icons/FilterList';

const styles = {
  root: {
    backgroundColor: "#191d20",
    color: "#FFFFFF",
    flexGrow: 1,
    marginBottom: 20
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  logo: {
    height:60,
    marginTop: '10px'
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  subhead: {
    backgroundColor: "#191d20",
    color: '#FFF'
  }
};

class NavAppBar extends Component {
    state = {
      top: false,
      left: false,
      bottom: false,
      right: false,
    };

    toggleDrawer = (side, open) => () => {
      this.setState({
        [side]: open,
      });
    };

    redirect = (event) => {
      if(event.currentTarget.dataset.id === '0'){
        console.log("going home")
        this.props.history.push("/")
      }else if(event.currentTarget.dataset.id === '1'){
        console.log("going to filter")
        this.props.history.push("/filter")
      }
    }
  
  render(){
    const { classes } = this.props;
    const sideList = (
      <div className={classes.list}>
        <List>
        <ListSubheader className={classes.subhead} component="div">Menu</ListSubheader>
          {['Home', 'Filter'].map((text, index) => (
            <ListItem 
              button key={text}
              data-id={index}
              onClick={this.redirect.bind(this)}>
              <ListItemIcon>{index % 2 === 0 ? <HomeIcon /> 
                                             : <FilterListIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );
    return (
      <div className={classes.root}>
        <div position="static">
          <Toolbar>
            <IconButton 
                className={classes.menuButton} 
                color="inherit" 
                aria-label="Menu"
                onClick={this.toggleDrawer('left', true)}
                >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <img className={classes.logo} src="qelogo.png" alt="Quickest" />
            </Typography>
          </Toolbar>
        </div>
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

NavAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default  compose(withStyles(styles))(withRouter(NavAppBar));


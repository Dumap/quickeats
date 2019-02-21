import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
  }
};

function NavAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <div position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            <img className={classes.logo} src="qelogo.png" alt="Quickest" />
          </Typography>
        </Toolbar>
      </div>
    </div>
  );
}

NavAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavAppBar);
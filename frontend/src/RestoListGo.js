import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarRatings from 'react-star-ratings';
import Reviews from './Reviews';
import Map from './Map';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { compose } from "recompose";


const styles = theme => ({
  slide: {
    padding: 15,
    minHeight: 300,
    color: '#fff',
  },
  card: {
    //maxWidth: 600,
    margin: 10
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  dark: {
    backgroundColor: "#191d20",
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

const Title = ({ children }) => <div className="title">{children}</div>;

class RestoListGo extends Component {
  state = { expanded: false,
            index: 0,
            open: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };

  goBackClick = () => {
    console.log("going back")
    if (this.state.index > 0){
      this.setState({
        index: this.state.index -1,
      });
    }
  }
  
  goForwardClick = () => {
    console.log("going forward")
    if (this.state.index < 20){
      this.setState({
        index: this.state.index +1,
      });
    }
  }

  priceSymbols = (level) => {
    let pricelevel = "$";
    if( level > 0){
      if ( level === 1 ) {
        return pricelevel;
      }
      return pricelevel + this.priceSymbols( level - 1 );
    }
  }
  componentDidMount = () => {
    if(this.props.newSearch){
      console.log("in restolist")
      let locArray = [this.props.lat, this.props.lng];
      let body = { location: locArray,
                    radius: this.props.prefs.radius,
                    type: 'restaurant',
                    maxprice: this.props.prefs.price,
                    rankby: this.props.prefs.rankby, 
                    keyword: this.props.prefs.keyword
                  }
      console.log("search", body)
      fetch("/nearbygo", {
        method: "POST",
        body: JSON.stringify(body)
      }).then(response => response.text())
        .then(response => {
            console.log(response)
          let parsedResponse = JSON.parse(response);
          if (parsedResponse.status) {
            //this.setState({ restos: parsedResponse.restos });
            this.props.dispatch({
              type: "set-resto-list",
              content: parsedResponse.restos
            });
            this.props.dispatch({
              type: "set-search-flg",
              content: false
            });
            this.props.dispatch({
              type: "clear-prefs"
            });
          }
        })
        .catch(err => console.log("ERROR",err));
    }
  };
  renderRestoList = (resto, index) => {
    console.log("Resto name", resto.name)
    return (
      <div key={resto.id} style={Object.assign({}, styles.slide, styles)}> 
        <Card className={this.props.classes.card}>
          <CardHeader
            avatar={
              <Avatar 
                aria-label="Restaurant" 
                src={resto.icon}
                className={this.props.classes.avatar} />
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={resto.name} 
            subheader={resto.hasOwnProperty("opening_hours") ? resto.opening_hours.open_now ? "Open Now" : "Closed" : ""}
          />

          <CardMedia
                className={this.props.classes.media}
                image={`https://maps.googleapis.com/maps/api/place/photo?photoreference=${resto.photos[0].photo_reference}&sensor=false&maxheight=1600&maxwidth=1600&key=AIzaSyBY89bOyBuSZnSkDdebZwUCFFw3jL2gcEI`}
                title={resto.name}
            />
          <CardContent>
          <Typography variant="h5" component="h2">
              {resto.name} 
            </Typography>
            <Typography className={this.props.classes.title} color="textSecondary" gutterBottom>
              {resto.vicinity}
            </Typography>
            <Typography>
              Price Level: {this.priceSymbols(resto.price_level)}
            </Typography>
            <Typography component={'span'} variant={'body2'}>
              Rating: <StarRatings
                        rating={resto.rating}
                        starRatedColor="blue"
                        numberOfStars={5}
                        name='rating'
                        starDimension="15px"
                        starSpacing="1px"
                      />
            </Typography>
          </CardContent>
          <CardActions className={this.props.classes.actions} disableActionSpacing>
          <IconButton aria-label="Go back"
            onClick={this.goBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton aria-label="Next"
            onClick={this.goForwardClick}>
            <ArrowForwardIcon />
          </IconButton>
          <IconButton aria-label="Map" onClick={this.handleOpen}>
            <Avatar 
                  aria-label="Map" 
                  src="google-maps.png"
                  className={this.props.classes.bigAvatar}
             />
          </IconButton>
          <IconButton
            className={classnames(this.props.classes.expand, {
              [this.props.classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Reviews id={resto.place_id}/>
        </Collapse>
        </Card>
        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
          >
          <DialogTitle className={this.props.classes.dark} id="responsive-dialog-title"><Title>{"How do you get there"}</Title></DialogTitle>
          <DialogContent>
            <br />
            <Map rlat={resto.geometry.location.lat} rlng={resto.geometry.location.lng}/>
            <br />
            <DialogContentText>Destination: <br /><br />
                              <b>{resto.name}</b><br />
                              {resto.vicinity}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              size="large" 
              className={this.props.classes.margin}
              onClick={this.handleClose} 
              autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  render() {
    const { index } = this.state;
    console.log("Hello")
    return (
      <div className="card">
        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
          {this.props.restos
            ? this.props.restos.map(this.renderRestoList)
            : "loading restorants"}  
        </SwipeableViews>
      </div>
    );
  }
}

let mapStateToProps = function(state) {
  return {
    lat: state.lat,
    lng: state.lng,
    newSearch: state.newSearch,
    prefs: state.prefs,
    restos: state.restos
  };
};

RestoListGo.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

let connectRestoListGo = connect(mapStateToProps)(RestoListGo);

export default  compose(withStyles(styles))(withMobileDialog()(connectRestoListGo));


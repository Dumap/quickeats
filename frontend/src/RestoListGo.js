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
import LinkIcon from '@material-ui/icons/Link';
import StarRatings from 'react-star-ratings';
import Reviews from './Reviews';
import Map from './Map';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { compose } from "recompose";

//const apiKey = process.env.REACT_APP_API_KEY
const apiKey = "AIzaSyAG8-zlUDe9RBGIPhO6BErIzH7qznXFkg8"
console.log("API KEY", apiKey)

const styles = theme => ({
  slide: {
    padding: 15,
    minHeight: 380,
    color: '#fff',
  },
  card: {
    minWidth: 350,
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
  }
});

const Title = ({ children }) => <div className="title">{children}</div>;

class RestoListGo extends Component {
  state = { expanded: false,
            index: 0,
            openedIndex: -1,
            expandIndex: -1,
            open: false,
            loaded: false,
            noresults: false
          };

  handleExpandClick = (index) => {
    this.setState(state => ({ expanded: !state.expanded, expandIndex: index }));
  };

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleOpen = (index) => {
    this.setState({open: true,  openedIndex: index});
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChangeIndex = (index) => {
    if(this.state.expanded){
      this.handleExpandClick(this.state.index)
    }
    this.setState({
      index: index
    });
  };

  goBackClick = (index) => {
    console.log("going back")
    if(this.state.expanded){
      this.handleExpandClick(index)
    }
    if (this.state.index > 0){
      this.setState({
        index: this.state.index -1,
      });
    }
  }
  
  goForwardClick = (index) => {
    console.log("going forward")
    if(this.state.expanded){
      this.handleExpandClick(index)
    }
    if (index < 20){
      this.setState({
        index: index +1,
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

  rad = (x) =>{
    return x * Math.PI / 180;
  }

  getDistance = (p1, p2) => {
    console.log("p1 lat", p1.lat)
    console.log("p1 lng", p1.lng)
    console.log("p2 lat", p2.lat)
    console.log("p2 lng", p2.lng)
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(p2.lat - p1.lat);
    var dLong = this.rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d); // returns the distance in meter
  }

  componentDidMount = () => {
    console.log("Is this a new search?", this.props.newSearch)
    if(this.props.newSearch){
      console.log("in componentDidMount")
      let locArray = [this.props.lat, this.props.lng];
      let body = { location: locArray,
                    type: 'restaurant',
                    maxprice: this.props.prefs.maxprice,
                    rankby: this.props.prefs.rankby, 
                  }
      if(this.props.prefs.rankby === "prominence"){
        body.radius = this.props.prefs.radius;
      }
      if(this.props.prefs.keyword !== ""){
        body.keyword = this.props.prefs.keyword;
      }
      console.log("search", body)
      fetch("/nearbygo", {
          method: "POST",
          body: JSON.stringify(body)
        }).then(response => response.text())
        .then(response => {
            let parsedResponse = JSON.parse(response);
            if (parsedResponse.status) {
              let arrayOfPromises = parsedResponse.restos.map(resto => {
                let detailBody = { placeid: resto.place_id}
                return fetch("/detail", {
                  method: "POST",
                  body: JSON.stringify(detailBody)
                }).then(response => response.json())
              })
              let promiseThatResolvesToAnArray = Promise.all(arrayOfPromises)
              promiseThatResolvesToAnArray.then(arrayOfRestos=> {
                const restos = arrayOfRestos.map(location => location.resto);

                console.log("arrayOfRestos", restos)
                this.props.dispatch({
                  type: "set-resto-list",
                  content: restos
                })
                console.log("setting newSearch to false")
                this.props.dispatch({
                  type: "set-search-flg",
                  content: false
                });
                console.log("clearing prefs")
                this.props.dispatch({
                  type: "clear-prefs"
                });
                if(restos.length > 0){
                  console.log("setting loaded to true")
                  this.setState({loaded: true})
                }
              })
            }
        })
        .catch(err => console.log("ERROR",err));    
    }
  }

  renderEndCard = () => {
    return(
      <Card className={this.props.classes.card}>
        <CardContent>
        <CardHeader
            avatar={
              <Avatar 
                aria-label="Restaurant"
                className={this.props.classes.avatar} />
            }
            title={"End of list"} 
          />
          <CardMedia
                className={this.props.classes.media}
                image="logo-small.png"
                title="Quickeats"
            /><br />
            <Typography variant="h6" component="h3">
                That's the end of the list! <br />Try adjusting the filter.
            </Typography>
        </CardContent>
        <CardActions className={this.props.classes.actions} disableActionSpacing>
          <IconButton aria-label="Go back"
            onClick={this.goBackClick}>
            <ArrowBackIcon />
          </IconButton>
        </CardActions>
      </Card>)
  }

  renderNoResults = () => {
    return(
      <Card className={this.props.classes.card}>
      <CardContent>
      <CardHeader
          avatar={
            <Avatar 
              aria-label="Restaurant"
              className={this.props.classes.avatar} />
          }
          title={"No Results"} 
        />
        <CardMedia
              className={this.props.classes.media}
              image="logo-small.png"
              title="Quickeats"
          /><br />
          <Typography variant="h6" component="h3">
              Sorry, No Results! <br />Try adjusting the filter.
          </Typography>
      </CardContent>
      <CardActions className={this.props.classes.actions} disableActionSpacing>
      </CardActions>
      </Card>)
  }

  renderLoading = () => {
    setTimeout(
      function() {
          this.setState({noresults: true});
      }
      .bind(this),
      5000)
    return <img src="food.gif" alt="Loading" width="360" />  
  }

  renderRestoList = (resto, index) => {
    console.log("resto", resto)
    console.log("resto name", resto.name)
    let p1 =  { lat: this.props.lat, lng: this.props.lng}
    let p2 =  { lat: resto.geometry.location.lat, lng: resto.geometry.location.lng}
    let distance = this.getDistance(p1, p2)
    let imgSrc;
    if(resto.photos){
      imgSrc = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${resto.photos[0].photo_reference}&sensor=false&maxheight=1600&maxwidth=1600&key=${apiKey}`
    }else{
      imgSrc = "logo-small.png"
    }
    return (
      <div key={resto.place_id} style={Object.assign({}, styles.slide, styles)}> 
        <Card className={this.props.classes.card}>
          <CardHeader
            avatar={
              <Avatar 
                aria-label="Restaurant" 
                src={resto.icon}
                className={this.props.classes.avatar} />
            }
            title={resto.name} 
            subheader={resto.hasOwnProperty("opening_hours") ? resto.opening_hours.open_now ? "Open Now" : "Closed" : ""}
          />
          <CardMedia
                className={this.props.classes.media}
                image={imgSrc}
                title={resto.name}
            />
          <CardContent>
            <Typography variant="h5" component="h2">
              {resto.name} 
            </Typography>
            <Typography className={this.props.classes.title} color="textSecondary" gutterBottom>
              {resto.formatted_address}<br />
              {resto.formatted_phone_number}
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
            onClick={() => this.goBackClick(index)}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton aria-label="Next"
            onClick={() => this.goForwardClick(index)}>
            <ArrowForwardIcon />
          </IconButton>&nbsp;&nbsp;&nbsp;&nbsp;
          <Tooltip title="Website">
            <IconButton aria-label="website">
              <a
                target="_blank" 
                rel="noopener noreferrer"
                href={resto.website}
              >
                <LinkIcon />
              </a>
            </IconButton>
          </Tooltip>&nbsp;&nbsp;
          <Tooltip title="Get directions">
            <IconButton aria-label="Map" onClick={() => this.handleOpen(index)}>
              <Avatar 
                    aria-label="Map" 
                    src="google-maps.png"
                    className={this.props.classes.bigAvatar}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Show more">
          <IconButton
            className={classnames(this.props.classes.expand, {
              [this.props.classes.expandOpen]: this.state.expanded,
            })}
            onClick={() => this.handleExpandClick(index)}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          </Tooltip>
        </CardActions>
        <Collapse in={this.state.expanded && this.state.expandIndex === index} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subheading" gutterBottom>Opening hours:</Typography><br />
            {!resto.opening_hours ? null : resto.opening_hours.weekday_text.map((day) => {return(<Typography key={day} variant="caption" color="textSecondary" gutterBottom>{day}</Typography>)})}
            <br /><Typography variant="subheading" gutterBottom>Reviews:</Typography>
            <Reviews id={resto.place_id}/>
          </CardContent>
        </Collapse>
        </Card>
        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.state.open && this.state.openedIndex === index}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
          >
          <DialogTitle className={this.props.classes.dark} id="responsive-dialog-title"><Title>{"How do you get there"}</Title></DialogTitle>
          <DialogContent>
            <br />
            {this.state.openedIndex !== index ? "Not available" : <Map rlat={resto.geometry.location.lat} rlng={resto.geometry.location.lng}/>}
            <br />
            <DialogContentText>
            <Typography variant="h5" component="h2">
              {resto.name} 
            </Typography>
            <Typography className={this.props.classes.title} color="textSecondary" gutterBottom>
              {resto.formatted_address}<br />
              {resto.formatted_phone_number}
            </Typography>
            <Typography className={this.props.classes.title} color="textSecondary" gutterBottom>
              Distance: {distance} meters
            </Typography>
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
    return (
      <div className="card">
      {console.log("loaded", this.state.loaded)}
      {this.state.noresults && !this.state.loaded ?
        this.renderNoResults() :
        ( this.props.restos && this.props.restos.length > 0 && this.state.loaded ?
        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
            {this.props.restos.map(this.renderRestoList)}
            {this.renderEndCard()}
        </SwipeableViews>
        : this.renderLoading())
        }
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

export default  compose(withStyles(styles))(withMobileDialog({breakpoint: 'md'})(connectRestoListGo));

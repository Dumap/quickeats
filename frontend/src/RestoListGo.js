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
            openedIndex: -1,
            open: false,
            loaded: false
          };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
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
    this.setState({
      index: index
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
    console.log("Is this a new search?", this.props.newSearch)
    let restoList = []
    if(this.props.newSearch){
      console.log("in componentDidMount")
      let locArray = [this.props.lat, this.props.lng];
      let body = { location: locArray,
                    radius: this.props.prefs.radius,
                    type: 'restaurant',
                    maxprice: this.props.prefs.maxprice,
                    rankby: this.props.prefs.rankby, 
                    keyword: this.props.prefs.keyword
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
              promiseThatResolvesToAnArray.then(arrayOfLocations=> {
                const restos = arrayOfLocations.map(location => location.resto);

                console.log("arrayOfLocations", arrayOfLocations)
                this.props.dispatch({
                  type: "set-resto-list",
                  content: restos
                })
                this.setState({loaded: true})
              })
              // parsedResponse.restos.forEach(function (resto) {
              //   let detailBody = { placeid: resto.place_id}
              //   fetch("/detail", {
              //       method: "POST",
              //       body: JSON.stringify(detailBody)
              //   }).then(response => response.text())
              //     .then(response => {
              //         let parsedDetail = JSON.parse(response);
              //         if (parsedDetail.status) {
              //           console.log("adding to restoList", parsedDetail.resto)
              //           restoList.push(parsedDetail.resto)
              //         }
              //       })
              //       .then( this.setState({loaded: true}))
              //       .then( this.props.dispatch({
              //         type: "set-resto-list",
              //         content: restoList
              //       }))
              //       .catch(err => console.log("ERROR",err));
              // }, this)
              console.log("Updating the store")
              console.log("RetoList", restoList)
              this.props.dispatch({
                type: "set-resto-list",
                content: restoList
              })
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
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={"End of list"} 
          />
          <CardMedia
                className={this.props.classes.media}
                image="logo-small.png"
                title="Quickeats"
            /><br />
            <Typography variant="h6" component="h3">
                That's the end of the list! Try adjusting the filter.
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
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={"No Results"} 
        />
        <CardMedia
              className={this.props.classes.media}
              image="logo-small.png"
              title="Quickeats"
          /><br />
          <Typography variant="h6" component="h3">
              Sorry, No Results! Try adjusting the filter.
          </Typography>
      </CardContent>
      <CardActions className={this.props.classes.actions} disableActionSpacing>
      </CardActions>
      </Card>)
  }

  renderRestoList = (resto, index) => {
    console.log("resto", resto)
    console.log("resto name", resto.name)
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
              {resto.address_components.formatted_address}
              {resto.address_components.formatted_phone_number}
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
          <IconButton aria-label="Map" onClick={() => this.handleOpen(index)}>
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
            {this.state.openedIndex !== index ? null : <Map rlat={resto.geometry.location.lat} rlng={resto.geometry.location.lng}/>}
            <br />
            <DialogContentText>Destination: <br /><br />
                              <b>{resto.name}</b><br />
                              {resto.address_components.formatted_address}
                              {resto.address_components.formatted_phone_number}
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
      {console.log("index", index)}
      {this.props.restos && this.state.loaded ?
        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
            {console.log("Restos in the store", this.props.restos)}
            {this.props.restos.map(this.renderRestoList)}
            {this.renderEndCard()}
        </SwipeableViews>
        : this.renderNoResults()}
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


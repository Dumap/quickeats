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
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarRatings from 'react-star-ratings';


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
});


class RestoListGo extends Component {
  state = { expanded: false,
            index: 0 };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
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
    if ( level === 1 ) {
      return pricelevel;
    }
    return pricelevel + this.priceSymbols( level - 1 );
  }
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
            subheader={resto.opening_hours.open_now ? "Open Now" : "Closed"}
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
          <CardContent>
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
              minutes.
            </Typography>
            <Typography paragraph>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
              heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
              browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
              chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
              salt and pepper, and cook, stirring often until thickened and fragrant, about 10
              minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography paragraph>
              Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
              without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat
              to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and
              cook again without stirring, until mussels have opened and rice is just tender, 5 to 7
              minutes more. (Discard any mussels that don’t open.)
            </Typography>
            <Typography>
              Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
          </CardContent>
        </Collapse>
        </Card>
      </div>
    );
  };
  render() {
    const { index } = this.state;
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
    restos: state.restos
  };
};

RestoListGo.propTypes = {
  classes: PropTypes.object.isRequired,
};


let connectRestoListGo = connect(mapStateToProps)(RestoListGo);

export default  withStyles(styles)(connectRestoListGo);


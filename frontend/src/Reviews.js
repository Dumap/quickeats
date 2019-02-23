import React, { Component } from "react";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import StarRatings from 'react-star-ratings';

class Reviews extends Component {
    state = { reviews: []};

componentDidMount = () => {
    console.log("in Reviews")

    let body = { placeid: this.props.id}
    fetch("/reviews", {
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => response.text())
        .then(response => {
            //console.log(response)
            let parsedResponse = JSON.parse(response);
            if (parsedResponse.status) {
                this.setState({ reviews: parsedResponse.reviews});
            }
        })
        .catch(err => console.log("ERROR",err));
    };
  renderReviews = (review, index) => {
      console.log("index", index)
    return(
        <CardContent>
            <CardHeader
            avatar={
              <Avatar 
                aria-label="Autor" 
                src={review.profile_photo_url} />
            }
            title={review.author_name} 
          />
            <Typography paragraph>
            <StarRatings
                        rating={review.rating}
                        starRatedColor="red"
                        numberOfStars={5}
                        name='rating'
                        starDimension="10px"
                        starSpacing="1px"
                    />
            </Typography>
            <Typography paragraph>
                {review.text}
            </Typography>
        </CardContent>
    )
  }  
  render() {
      console.log("number of reviews:", this.state.reviews)
    return (
        <CardContent>
            {this.state.reviews ? this.state.reviews.map(this.renderReviews): "loading reviews"}  
        </CardContent>
    );
  }
}

export default Reviews;

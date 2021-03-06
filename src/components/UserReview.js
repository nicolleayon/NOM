import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import {db} from '../firebase';
import firebase from 'firebase/app';

class UserReview extends Component {
	constructor(props){
	  super(props);
	  this.state = {
		new: true,
		rating: false,
		ascending: true,
	  }
	}
   reviewSort = (reviews) => {
	  if (this.state.rating === true){
		return reviews.sort((a, b) => {return getUserRating(a) - getUserRating(b)});
	  }else return reviews;
	}
	componentDidMount() {
		db.onceGetUsers('users/' + this.state.uid).then(snapshot =>
	  this.setState({
	  reviews: snapshot.val().reviews
	   }),
		);
	}
	onSubmit = (event) => {
	  db.ref('users/' + this.state.uid).update({
		reviews: this.state.reviews,
	  });
	}
	render() {
	  if (this.props.review == null){
		return(<p>There are no reviews!</p>);
	  }
	  var reviewers = getUserReviewers(this.props.review)   ;
	  const avgRating = avgUserRating(reviewers);
	  reviewers = this.reviewSort(reviewers);
		return (
		  <div>
		  Sort By:
		  <button onClick = {() => this.setState({new: true, highRating: false})}>New</button>
		  <button onClick = {() => this.setState({new: false, highRating: true})}>Rating</button>

		  <h5>Avg Rating:  {avgRating} </h5>
			  {reviewers.map((review) =>
			  <div>
				{getReviewerName(review)} &nbsp;
				User Rating : <StarRatings rating = {getUserRating(review)}
											starDimension = '23px'
											starSpacing = '0px'
											starRatedColor = "yellow"/><br></br>
				{getUserReview(review)}<br></br>
			</div>
			  )}
		  </div>
		);
	}
}

function avgUserRating(userReview){
  let numOfReviews = 0;
  let sumRating = 0;
  for(let i in userReview){
	if (userReview[i] !== null){
	  sumRating += getUserRating(userReview[i]);
	  numOfReviews++;
	}
  }
  return ( sumRating / numOfReviews);

}

function getUserReviewers(reviews){
  let userReviewers = [];
  for(let i in reviews){
	userReviewers.push(reviews[i]);
  }
  return userReviewers;
}
function getReviewerName(reviewer){
  return reviewer.reviewer;
}
function getUserRating(reviewer){
  return parseFloat(reviewer.rating);
}
function getUserReview(reviewer){
  return reviewer.review;
}

  export default UserReview;
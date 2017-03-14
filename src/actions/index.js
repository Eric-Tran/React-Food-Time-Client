import axios from 'axios';
import Yelp from 'yelp';
import { browserHistory } from 'react-router';
import { reset } from 'redux-form';
import { 
	AUTH_USER,
	UNAUTH_USER,
	AUTH_ERROR,
	FETCH_MESSAGE,
	FETCH_YELP_DATA,
	POST_WAIT_DATA,
	FETCH_RECENT_ACTIVITY
} from './types';

const ROOT_URL = 'http://ec2-54-213-180-21.us-west-2.compute.amazonaws.com';

export function signinUser({ email, password }) {
	//reduxThunk gives access to dispatch function allowing us to dispatch our own actions anytime
	//return function to get direct access to dispatch
	return function(dispatch) {
		//Submit email/password to the server
		//ES6 { email: email, password: password }
		axios.post(`${ROOT_URL}/signin`, { email, password })
			.then(response => {
				//If request is good...
				// - update state to indicate user is authenticated
				dispatch({ type: AUTH_USER });
				// - Save the JWT token //localStorage is native to window scope, no importing.
				localStorage.setItem('token', response.data.token);
				// - redirect to the route '/feature'
				browserHistory.push('/search');
			})
			.catch(() => {
				//If the request is bad...
				//- Show an error to the user
				dispatch(authError('Invalid email or password.'));
			});
	}
}

export function signupUser({ email, password }) {
	return function(dispatch) {
		axios.post(`${ROOT_URL}/signup`, { email, password })
		.then(response => {
			dispatch({ type: AUTH_USER });
			localStorage.setItem('token', response.data.token);
			browserHistory.push('/search');
		})
		.catch(response => dispatch(authError(response.data.error)));
	}
}

export function authError(error) {
	return {
		type: AUTH_ERROR,
		payload: error
	};
}

export function signoutUser() {
	localStorage.removeItem('token');
	return { type: UNAUTH_USER };
}

export function fetchMessage() {
	return function(dispatch) {
		axios.get(ROOT_URL, {
			headers: { authorization: localStorage.getItem('token') }})
			.then(response => {
				dispatch({
					type: FETCH_MESSAGE,
					payload: response.data.message
				})
			})
	}
}

//Get recent activity
export function fetchRecentActivity() {
	return function(dispatch) {
		axios.get(`${ROOT_URL}/activity`)
		.then(response => {
			dispatch({
				type: FETCH_RECENT_ACTIVITY,
				payload: response
			})
		})
	}
}

//Posting Wait Data
export function postWait( {id, day, arrival, wait, name} ) {
	return function(dispatch) {
		axios.post(`${ROOT_URL}/data`, {id, day, arrival, wait, name})
		.then(response => {
			dispatch({
				type: POST_WAIT_DATA,
				payload: response
			})
		})
	}
}


//YELP API
export function fetchData( {term, location} ) {
	return function(dispatch) {
		axios.post(`${ROOT_URL}/yelp`, {term, location})
		.then(response => {
			dispatch({ 
				type: FETCH_YELP_DATA,
				payload: response 
			});
			dispatch(reset('search'));
		})
	}
}




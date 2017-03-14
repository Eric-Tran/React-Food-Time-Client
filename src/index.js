import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';

import App from './components/app';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Feature from './components/feature';
import Items from './components/items';
import RequireAuth from './components/auth/require_auth';
import Welcome from './components/welcome';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
//store contains the redux state
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');
//If we have a token, consider the user signed in
if (token) {
  //We need to update the application state
  store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
	<Provider store={store}>
  		<Router history={browserHistory}>
  			<Route path="/" component={App}>
        <IndexRoute component={Welcome} />
  				<Route path="signin" component={Signin} />
  				<Route path="signout" component={Signout} />
  				<Route path="signup" component={Signup} />
          <Route path="search" component={RequireAuth(Feature)} />
          <Route path="decide" component={RequireAuth(Items)} />
  			</Route>
  		</Router>
  </Provider>
  , document.querySelector('.container'));

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";
import './index.css';
import App from './App';

let reducer = function(state, action) {
    switch (action.type) {
      case "set-location":
        return { ...state, lat: action.lat, lng: action.lng };
      case "set-resto-list":
        return { ...state, restos: action.content };
      default:
        return state;
    }
  };
  
  const myStore = createStore(
    reducer,
    { lat: '45.5017156',
      lng: '-73.5728669',
      restos: []},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

ReactDOM.render(
    <Provider store={myStore}>
        <App />
    </Provider>, 
    document.getElementById('root')
);


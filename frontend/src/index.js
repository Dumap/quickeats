import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";
import './index.css';
import App from './App';

let reducer = function(state, action) {
    switch (action.type) {
      case "set-location":
        localStorage.setItem('lat', action.lat);
        localStorage.setItem('lng', action.lng);
        return { ...state, lat: action.lat, lng: action.lng };
      case "set-resto-list":
        return { ...state, restos: action.content };
      case "set-search-flg":
        return { ...state, newSearch: action.content };
      default:
        return state;
    }
  };

  const initialState = {
    lat: localStorage.getItem('lat'),
    lng: localStorage.getItem('lng'),
    newSearch: false,
    restos: []
  };
  
  const myStore = createStore(
    reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

ReactDOM.render(
    <Provider store={myStore}>
        <App />
    </Provider>, 
    document.getElementById('root')
);


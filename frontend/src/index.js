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
      case "clear-resto-list":
      localStorage.removeItem('restos');
        return { ...state, restos: [] };
      case "add-resto-list":
        //localStorage.setItem('restos', JSON.stringify(state.restos.concat(action.content)));
        return { ...state, restos: state.restos.concat(action.content) };
      case "set-resto-list":
        localStorage.setItem('restos', JSON.stringify(action.content));
        return { ...state, restos: action.content };
      case "set-search-flg":
        return { ...state, newSearch: action.content };
      case "set-prefs":
        return { ...state, prefs: action.content };
      case "clear-prefs":
        let defaultPrefs = {
          radius: '1000',
          maxprice: '4',
          rankby: 'prominence',
          keyword: ''
        }
        return { ...state, prefs: defaultPrefs };
      default:
        return state;
    }
  };

  function IsJsonString(str) {
    try {
        let tmp = JSON.parse(str);
        console.log("It's JSON", tmp)
    } catch (e) {
        return false;
    }
    return true;
}

  const initialState = {
    lat: localStorage.getItem('lat'),
    lng: localStorage.getItem('lng'),
    newSearch: false,
    prefs: {
      radius: 1000,
      maxprice: 4,
      rankby: 'prominence',
      keyword: ''
    },
    restos: IsJsonString(localStorage.getItem('restos')) ? JSON.parse(localStorage.getItem('restos')) : []
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


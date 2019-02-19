import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let reducer = function(state, action) {
    switch (action.type) {
      case "set-resto-list":
        return { ...state, restos: action.content };
      default:
        return state;
    }
  };
  
  const myStore = createStore(
    reducer,
    {restos: []},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

ReactDOM.render(
    <Provider store={myStore}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

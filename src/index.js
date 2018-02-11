import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './reducers/Reducers'
import App from './components/App.jsx';

// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';

let store = createStore(rootReducer); // TODO: will add middleware sometime for this as well

ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>,
    document.getElementById('root')
);

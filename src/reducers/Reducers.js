// Copyright (c) 2018 BlockChat

// Author:
// Maintainer:

/*! \file Reducers.js
    \brief Has the reducers that are being used in the application
*/

import { combineReducers } from 'redux';

import {
    ADD_CONTACT,
    ADD_MESSAGE,
    LOADING_STATUS,
    LOGIN,
    SEND_MESSAGE,
    SET_CURRENT_CONTACT
} from '../constants/ActionTypes';

//! define an initial state
// TODO: change the contactList to either hashmaps or associative arrays
const initialState = {
    currentContact: '',     //!< The ID of the contact that has been selected
    contactList: [],        //!< The list of all the users' contacts
    messageList: [],         //!< List of the last couple of messages that were sent
                            //!< between the currentContact and this user
    isSignedIn: false,
    isLoading: false,
    userProfile: {},        //!< Has userName, userBio and all the other profile information
    fullUserData: {}       //!< Has full data and other stuff like userID etc.
};

//! Reducer to login the user and store the initial data for the app
function logInUserReducer(state = initialState, action = {}) {
    switch (action.type) {
    case LOGIN:
        return Object.assign({}, state, {
            isSignedIn: true,
            userProfile: action.payload.userProfile,
            fullUserData: action.payload.fullUserData
        });
    default:
       return state;
    }
}

//! Reducer to update contacts
function addContactsReducer(state = initialState, action = {}) {
    switch (action.type) {
    case ADD_CONTACT:
        return Object.assign({}, state, {
            contactList: contactList.concat([action.payload])
        });
    default:
       return state;
    }
}

//! Reducer to update contacts
function updateLoadingStatusReducer(state = initialState, action = {}) {
    switch (action.type) {
    case LOADING_STATUS:
        return Object.assign({}, state, {
            isLoading: action.payload
        });
    default:
       return state;
    }
}

//! Reducer to handle actions on messages
//! The payload is a messaege object that is define in? TODO: define this
function messageReducer(state = initialState, action = {}) {
    switch (action.type) {
    case ADD_MESSAGE:
        return Object.assign({}, state, {
            messageList: messageList.concat([action.payload])
        });
    default:
       return state;
    }
}

//! Reducer to handle actions on the current contact
function currentContactReducer(state = initialState, action = {}) {
    switch (action.type) {
    case SET_CURRENT_CONTACT:
        return Object.assign({}, state, {
            currentContact: action.payload
        });
    default:
       return state;
    }
}

//! the root reducer: the functions should be ordered in the order
//! in which they appear above
const rootReducer = combineReducers({
    logInUserReducer,
    addContactsReducer,
    updateLoadingStatusReducer,
    messageReducer,
    currentContactReducer,
});

export default rootReducer;
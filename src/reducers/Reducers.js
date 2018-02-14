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
    SET_CURRENT_CONTACT,
    SET_MESSAGE,
    SET_INPUT_BAR_TEXT,
    SET_SEARCH_BAR_TEXT,
    UPDATE_LAST_SEEN
} from '../constants/ActionTypes';

//! define an initial state
// TODO: change the contactList to either hashmaps or associative arrays
const initialState = {
    currentContact: '',     //!< The ID of the contact that has been selected
    contactList: [],        //!< The list of all the users' contacts
    messageList: [],         //!< List of the last couple of messages that were sent
                            //!< between the currentContact and this user
    lastMessage: {},        //!< A list of last message sent to or received from a user 
    userName: '',
    userPic: null,
    userBio: '',
    isSignedIn: false,
    isLoading: false,
    userProfile: {},        //!< Has userName, userBio and all the other profile information
    fullUserData: {},       //!< Has full data and other stuff like userID etc.


    // Data for the search Bar
    searchBarText: '',

    inputBarText: ''
};

//! Reducer to login the user and store the initial data for the app
function logInUserReducer(state = initialState, action = {}) {
    //console.log("logInUserReducer Called");
    switch (action.type) {
    case LOGIN:
        return Object.assign({}, state, {
            isSignedIn: true,
            userProfile: action.payload.userProfile,
            fullUserData: action.payload.fullUserData,
            userName: action.payload.userName,
            userPic: action.payload.userPic,
            userBio: action.payload.userBio
        });
    default:
       return state;
    }
}

//! Reducer to update contacts
function addContactsReducer(state = initialState, action = {}) {
    //console.log("addContactsReducer Called");
    switch (action.type) {
    case ADD_CONTACT:
        return Object.assign({}, state, {
            contactList: state.contactList.concat(action.payload)
        });
    default:
       return state;
    }
}

//! Reducer to update contacts
function updateLoadingStatusReducer(state = initialState, action = {}) {
    //console.log("updateLoadingStatusReducer Called");
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
    //console.log("messageReducer Called");
    switch (action.type) {
    case ADD_MESSAGE:
        return Object.assign({}, state, {
            messageList: state.messageList.concat(action.payload)
        });
    case SET_MESSAGE:
        return Object.assign({}, state, {
            messageList: action.payload
        });
    default:
       return state;
    }
}

//! Reducer to add the last message to a list of last messages that
//! have been sent or removed from a user
function updateLastMessageReducer(state = initialState, action = {}) {
    //console.log("updateLastMessageReducer Called");
    switch (action.type) {
    case UPDATE_LAST_SEEN:
        //console.log('before')
        //console.log(state.lastMessage)
        state.lastMessage[action.payload.userID] = action.payload.message
        //console.log('after')
        //console.log(state.lastMessage)
        return Object.assign({}, state, {
            lastMessage: state.lastMessage
        });
    default:
       return state;
    }
}

//! Reducer to handle actions on the current contact
function currentContactReducer(state = initialState, action = {}) {
    //console.log("currentContactReducer Called");
    switch (action.type) {
    case SET_CURRENT_CONTACT:
        return Object.assign({}, state, {
            currentContact: action.payload
        });
    default:
       return state;
    }
}

function setSearchBarTextReducer(state = initialState, action = {}) {
    //console.log("setSearchBarTextReducer");
    switch (action.type) {
    case SET_SEARCH_BAR_TEXT:
        return Object.assign({}, state, {
            searchBarText: action.payload
        });
    default:
       return state;
    }
}


function setInputBarTextReducer(state = initialState, action = {}) {
    //console.log("setInputBarTextReducer");
    //console.log('Here 9')
    switch (action.type) {
    case SET_INPUT_BAR_TEXT:
        return Object.assign({}, state, {
            inputBarText: action.payload
        });
    default:
       return state;
    }
}

function allReducers(state = initialState, action = {}) {
    //console.log('Here 7')
    switch (action.type) {
        case LOGIN:
            return logInUserReducer(state, action);
        
        case ADD_CONTACT:
            return addContactsReducer(state, action);
        
        case LOADING_STATUS:
            return updateLoadingStatusReducer(state, action);
        
        case ADD_MESSAGE:
            return messageReducer(state, action);
        
        case SET_MESSAGE:
            return messageReducer(state, action);

        case SET_CURRENT_CONTACT:
            return currentContactReducer(state, action);
        
        case SET_INPUT_BAR_TEXT:
        //console.log('Here 8')
            return setInputBarTextReducer(state, action);

        case SET_SEARCH_BAR_TEXT:
            return setSearchBarTextReducer(state, action);
        
        case UPDATE_LAST_SEEN:
            return updateLastMessageReducer(state, action);
        default:
           return state;
    }
}

//! the root reducer: the functions should be ordered in the order
//! in which they appear above
const rootReducer = combineReducers({
    allReducers
});

export default rootReducer;
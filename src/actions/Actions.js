// Copyright (c) 2018 BlockChat

// Author:
// Maintainer:

/*! \file Actions.js
    \brief Has the action creators that makes the actions that will be perfomed on 
           the data on the store. Each ation has a type and payload. type specifies
           what type of action is it, and the payload is any relevant data (if any)
           that the reducer function will need to resolve the action.
*/

import {
    ADD_CONTACT,
    ADD_MESSAGE,
    LOADING_STATUS,
    LOGIN,
    SEND_MESSAGE,
    SET_CURRENT_CONTACT,
    SET_MESSAGE,
    SET_INPUT_BAR_TEXT,
    SET_SEARCH_BAR_TEXT
} from '../constants/ActionTypes';

//! Creates an action to save the date of the user after being logged in
export const logInUser = (usrProfile = {}, userData = {}, usrName='', usrPic, usrBio) => {
    return {
        type: LOGIN,
        payload: {
            userProfile: usrProfile,
            fullUserData: userData,
            userName: usrName,
            userPic: usrPic,
            userBio: usrBio
        }
    }
}

//! Creates an action to update the contacts for the user
export const addContacts = (contacts = []) => {
    return {
        type: ADD_CONTACT,
        payload: contacts
    }
}

//! Creates an action to update the contacts for the user
export const updateLoadingStatus = status => {
    return {
        type: LOADING_STATUS,
        payload: status
    }
}

//! Creates an action to add a message
export const setMessageArray = text => {
    return {
        type: SET_MESSAGE,
        payload: text
    }
}

//! Creates an action to add a message
export const addMessage = text => {
    return {
        type: ADD_MESSAGE,
        payload: text
    }
}

//! Creates an action to send a message
export const sendMessage = text => {
    return {
        type: SEND_MESSAGE,
        payload: text
    }
}

//! Creates an action to send a message. userID == blockStackID
export const setCurrentContact = userID => {
    return {
        type: SET_CURRENT_CONTACT,
        payload: userID
    }
}

//! Creates an action to send a message
export const setSearchBarText = text => {
    return {
        type: SET_SEARCH_BAR_TEXT,
        payload: text
    }
}

//! Creates an action to send a message
export const setInputBarText = text => {
    console.log('actionc called')
    return {
        type: SET_INPUT_BAR_TEXT,
        payload: text
    }
}
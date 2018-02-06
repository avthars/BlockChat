// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file Home.jsx
    \brief HomePage component which houses SideBar and ChatScreen components
*/
import React, { Component, Link } from 'react';
import {SideBar} from './SideBar.jsx';
import {ChatScreen} from './ChatScreen.jsx';
import {Profile} from './Profile.jsx';
import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    putFile,
    lookupProfile,
  } from 'blockstack';
import * as blockstack from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const username = 'Felix Madutsa';
const sendername = 'Sender Name';
//const blockStackId = 'f.id';
//const status = 'This us just a sample status for a start. I am going high right now so that I can leave';
const message_text = 'this is my message to the world, and it is this that I am writing because I feel like it and I';
const time_sent = new Date();

//dummy messages to display in table
const MESSAGES = [
    {id: 1, sender: username, message: message_text, time_received: time_sent.getDate()},
    {id: 2, sender: username, message: message_text, time_received: time_sent.getDate() + 1},
    {id: 3, sender: username, message: message_text, time_received: time_sent.getDate() + 2},
    {id: 4, sender: username, message: message_text, time_received: time_sent.getDate() + 3},
    {id: 5, sender: username, message: message_text, time_received: time_sent.getDate() + 4},
    {id: 6, sender: username, message: message_text, time_received: time_sent.getDate() + 5},
    {id: 7, sender: username, message: message_text, time_received: time_sent.getDate() + 6},
    {id: 8, sender: username, message: message_text, time_received: time_sent.getDate() + 7}
  ];

//**************************************************************
// MessageTile component: helper component
// unit for contact display
//**************************************************************
class MessageTile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}; 
    }

    render() {

        return (

        <table className="table table-hover">
            <tbody>
            {
                this.props.messages.map((message) => {  
                    return (
                        <tr><td className="table-row">
                        <div className="sidebar-message-tile" key={message.id}> 
                            <div className="other-user-pic"> 
                                <img src={avatarFallbackImage} className="img-rounded message-pic"/>
                            </div>

                            <div className="message-preview">
                                <p> 
                                    <span className="sender-name">{message.sender}</span>
                                    <span className="message-time">{message.time_received}</span> 
                                </p>
                                    <p className="message-snippet">{message.message}</p>
                            </div>
                        </div>
                        </td></tr>
                    );
                })
            }       
            </tbody>
        </table>
        );
    }
}

//**************************************************************
// Home component: manages state of messages and
//**************************************************************
export class Home extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
            //user info  
            userName: this.props.userName,
            userId: this.props.userId,
            userBio: this.props.userBio,
            contactList: this.props.contactList,
            //contact currently chatting to -- hard coded rn
            // change to radjei.id or avthar.id, depending desired test
            currContact: 'radjei.id',
            //messages for current chat
            messageList: [],
            isLoading: false,
          }; 
        this.putDataInStorage  = this.putDataInStorage.bind(this);
        this.fetchMessageData  = this.fetchMessageData.bind(this);
      }

      //update component when parent state changes
      componentWillReceiveProps(nextProps) {
          this.setState({
              userName: nextProps.userName,
              userId:nextProps.userId,
              userBio: nextProps.userBio,
              contactList: nextProps.contactList,
          }, () => {
              console.log('Home state:');
              console.log(this.state);
          });
      }

    //puts contact data into users blockstack storage
    putDataInStorage(data, contactName) {
        //debugging:
        console.log('In putData()');
        console.log("Data to be put in storage");
        console.log(data);
        //TO DO: strip contact name of .id
        var rawContact = contactName.replace('.id','');
        var STORAGE_FILE_PATH = rawContact + '.json';
        console.log('Filename: ' + STORAGE_FILE_PATH);
        var options = {encrypt: false};
        let success = blockstack.putFile(STORAGE_FILE_PATH, JSON.stringify(data), options);
        this.setState({messageList: data}, () => {
        console.log('updating state after putting msg in storage');
        console.log(this.state.messageList);});
        if (!success){
        console.log("ERROR: Could not put file in storage");
        }
        else {
        console.log("SUCCESS: PUT FILE IN USER STORAGE");}
    }

    //messages conversation from contactId
    fetchMessageData(contactId){
        this.setState({isLoading: true});
        const options = { username: contactId  };
        const FILE_NAME = this.state.userId.replace('.id','') + '.json';
        console.log(FILE_NAME);
        var oldMessages = this.state.messageList;
        getFile(FILE_NAME, options)
                .then((file) => {
                  var msgs = JSON.parse(file || '[]')
                  this.setState({
                    messageList: msgs,
                  }, () => {
                      console.log('Messages after fetching messages from contact ' + contactId);
                      console.log(this.state.messageList);
                  })
                })
                .catch((error) => {
                  console.log('could not fetch messages from ' + contactId)
                  //reset state back to before load
                  this.setState({messageList: oldMessages});
                })
                .finally(() => {
                  this.setState({isLoading: false});
                })
    }

    //TEMPORARY: Assume there was a message while you were offline, pull data from currContact
    componentDidMount(){
        this.setState({isLoading: true},() => {
            this.fetchMessageData(this.state.currContact);
        });

        this.setState({isLoading:false}, () => {
            console.log('state after component mount: ');
            console.log(this.state);
        });
    }
    
      render() {
          
        return (
            <div className="container-fluid homep">
                <div className="row flex-xl-nowrap home">

                    <div className="col-12 col-lg-3 col-md-4 col-xl-2 bd-sidebar">
                        <div className="profile-sidebar">
                            <div className="profile-userpic">
                                <img src={this.props.userPic} className="img-rounded avatar"/>
                            </div>

                            <div className="text-center username-id">
                                <p className="font-weight-bold">{this.props.userName + ' | ' + this.props.userId} </p>
                            </div>

                            <div className="text-center user-status">
                                <p>{this.props.userBio} </p>
                            </div>
                        </div>

                        <div className="message-and-search-box">
                            <div className="search-bar">
                                <form>
                                    <div className="input-group">
                                        <div className="input-group-addon"><i className="fa fa-search"></i></div>
                                        <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search BlockChat"/>
                                    </div>
                                </form>
                            </div>

                            <div className="messages-sidebar">
                                <MessageTile messages={MESSAGES}/>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <ChatScreen
                            putData = {this.putDataInStorage}
                            messageList = {this.state.messageList}
                            currContact = {this.state.currContact}
                        />
                        <button 
                        className = 'btn btn-primary'
                        onClick = {this.props.handleSignOut}
                        > 
                        Logout
                        </button>
                    </div>
                </div>
            </div>
        );
      }
}
    
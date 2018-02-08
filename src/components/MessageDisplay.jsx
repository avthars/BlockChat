// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file MessageDisplayScreen.jsx
    \brief Display messages for a particulat chat
*/
import React, { Component, Link } from 'react';
import { InputBar } from './InputBar.jsx';

//**************************************************************
//InputBox component: Box that displays messages for current chat
//Props: messageList - list of messages for current chat
//       userProfilePic
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
//**************************************************************
export class MessageDisplay extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
              messageList: this.props.messageList, 
              currContactName: '',
              currContactProfilePic: '',
              currContact: '',
            };
      }

      componentWillReceiveProps(nextProps){
          this.setState({
              messageList: nextProps.messageList,
              currContactName: nextProps.currContactName,
              currContactProfilePic: nextProps.currContactProfilePic,
              currContact: nextProps.currContact,
          }, () => {console.log("Updated props in Message Display")});
      }
    

      render() {
        return (
            <MessageList messageList = {this.state.messageList} userId={this.props.userId}/>
        );
      }
}

//**************************************************************
//InputBox component: Box that displays messages for current chat
//Props: messageList - list of messages for current chat
//       userProfilePic
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
// custome bootstrap: https://v4-alpha.getbootstrap.com/components/list-group/#custom-content
//**************************************************************
class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        console.log(this.props.messageList);
        console.log(this.props.userId);
        return(
            <div>
                <ul className = "list-group">
                     {this.props.messageList.map(message => (
                        <MessageInstance message={message} userId = {this.props.userId} />
                    ))}
                </ul>
            </div>
        );
    }
}


class MessageInstance extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (this.props.message.by == this.props.userId) {
            console.log(this.props.message);
            console.log(this.props.currContact);
            return (
                <li className = "list-group-item text-right" key={this.props.message.id}>{this.props.message.text}</li>
            );
        }
        else {
            console.log(this.props.message);
            console.log(this.props.currContact);
            return (
                <li className = "list-group-item text-left" key={this.props.message.id}>{this.props.message.text}</li>
            );
        }
    }
}
import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import firebase from '../../firebase';
import { connect } from 'react-redux'
import { setUserPosts } from '../../actions'
import MessageForm from './MessageForm';
import Message from './Message'
class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        privateChannel: this.props.isPrivateChannel,
        privateMessageRef: firebase.database().ref('privateMessages')
    }
    componentDidMount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.addListener(channel.id);
        }
    }
    addListener = channelId => {
        this.addMessageListener(channelId)
    }
    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            console.log("messages", loadedMessages);
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })  
            this.countUniqueUsers(loadedMessages);
            this.countUserPosts(loadedMessages)
        })
    }
    countUserPosts = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            }
            else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {});
        console.log(userPosts);
        this.props.setUserPosts(userPosts)

    }
    getMessagesRef = () => {
        const { messagesRef, privateChannel, privateMessageRef } = this.state;
        return privateChannel ? privateMessageRef : messagesRef;
    }
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessage());
    }
    handleSearchMessage = () => {
        const channelMessage = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi')
        const searchResults = channelMessage.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
                acc.push(message)
            }
            return acc;
        }, [])
        this.setState({ searchResults })
        setTimeout(() => this.setState({ searchLoading: false }), 1000)
        console.log("search result", this.state.searchResults);

    }
    countUniqueUsers = messages => {
        const uniqueUSers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc;
        }, [])
        console.log("channel user", uniqueUSers);
        const plural = uniqueUSers.length > 1 || uniqueUSers.length === 0
        const numUniqueUsers = `${uniqueUSers.length} user${plural ? 's' : ''}`
        this.setState({ numUniqueUsers })
    }
    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (<Message
            key={message.timestamp} message={message} user={this.state.user} />))
    )
    displayChannelName = channel => { return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '' }
    render() {
        const { messagesRef, privateChannel, channel, user, messages, numUniqueUsers, searchTerm, searchResults, searchLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    searchLoading={searchLoading} isPrivateChannel={privateChannel}
                    handleSearchChange={this.handleSearchChange} numUniqueUsers={numUniqueUsers} channelName={this.displayChannelName(channel)} />
                <Segment>
                    <Comment.Group className="messages">
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef} />
            </React.Fragment>
        )
    }
}
export default connect(null, { setUserPosts })(Messages)
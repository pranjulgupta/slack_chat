import firebase from '../../firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon, Modal, Form, Input, Button, Message, } from 'semantic-ui-react';
class Channels extends Component {
    state = {
        user: this.props.currentUser,
        activeChannel: '',
        channels: [],
        channel: null,
        modal: false,
        firstLoad: true,
        channelName: '',
        channelDetails: '',
        errors: [],
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        notifications: []
    };
    componentDidMount() {
        this.addListeners();
    }
    componentWillUnmount() {
        this.removeListeners();
    }
    removeListeners = () => {
        this.state.channelsRef.off();
    };

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            console.log(loadedChannels);
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
            // this.addNotificationListenener(snap.key);
        })
    }
    setFirstChannel = () => {
        const firstchannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstchannel);
            this.setActiveChannel(firstchannel)
        }
        this.setState({ firstLoad: false })
    }
    addChannel = () => {
        const { channelDetails, channelName, channelsRef, user } = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }
        channelsRef.child(key).update(newChannel).then(() => {
            this.setState({ channelName: '', channelDetails: '', errors: '' })
            this.closeModal();
            console.log('channel added');

        }).catch(err => {
            console.log(err);
            this.setState({ errors: this.state.errors.concat(err) })

        })
    }
    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.addChannel()
        }


    }
    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);
    isFormValid = () => {
        let errors = [];
        let error;
        if (this.isFormEmpty(this.state)) {
            error = { message: 'All fields are required' }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else {
            
            return true
        }
    }
    isFormEmpty = ({ channelDetails, channelName }) => {
        return !channelDetails.length || !channelName.length;
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }
    closeModal = () => {
        this.setState({ modal: false })
    };
    openModel = () => {
        this.setState({ modal: true });

    }
    displayChannels = channels => (
        channels.length && channels.map(channel => (
            <Menu.Item key={channel.id} onClick={() => this.changeChannel(channel)} name={channel.name}
                style={{ opacity: '0.7' }} active={channel.id === this.state.activeChannel}>
                # {channel.name}
            </Menu.Item>
        ))
    )
    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    }
    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id })
    }
    render() {
        const { channels, modal, errors } = this.state
        return (
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" />Channels
                    </span>{' '}
                        ({channels.length})<Icon name="add" onClick={this.openModel} />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input fluid label="Name Of Channel" name="channelName" onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Field>
                                <Input fluid label="About the Channel" name="channelDetails" onChange={this.handleChange} />
                            </Form.Field>
                        </Form>
                        {errors.length > 0 && (<Message error>
                            <h3>Error</h3>{this.displayErrors(errors)}
                        </Message>)}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" />Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" />Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}
export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);
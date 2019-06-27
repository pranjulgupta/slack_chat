import React, { Component } from 'react'
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/v4';
import ProgressBar from './ProgressBar';
class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        uploadTask: null,
        uploadState: '',
        staorageRef: firebase.storage().ref(),
        percentUploaded: 0
    }
    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }
    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },

        };
        if (fileUrl !== null) {
            message['image'] = fileUrl
        }
        else {
            message['content'] = this.state.message;
        }
        return message;
    }
    sendMessage = () => {

        const { getMessagesRef } = this.props;
        console.log("ref", getMessagesRef)
        const { message, channel } = this.state;
        if (message) {
            this.setState({ loading: true });
            getMessagesRef().child(channel.id).push().set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                }).catch(err => {
                    console.log(err);
                    this.setState({
                        loading: false, errors: this.state.errors.concat(err)
                    })
                })
        }
        else {
            this.setState({ errors: this.state.errors.concat({ message: 'Add a Message' }) })
        }
    }
    getPath = () => {
        if (this.props.isPrivatChannel) {
            return `chat/private-${this.state.channel.id}`;
        }
        else {
            return 'chat/public'
        }
    }
    uploadFile = (file, metadata) => {
        console.log(file, metadata);
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;
        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.staorageRef.child(filePath).put(file, metadata)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.setState({ percentUploaded })
            },
                err => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })

                },
                () => {
                    this.state.uploadTask.snapshot.ref.getDownloadURL().then
                        (downloadUrl => {
                            this.sendFileMessage(downloadUrl, ref, pathToUpload);
                        }).catch(err => {
                            console.log(err);
                            this.setState({
                                errors: this.errors.concat(err),
                                uploadState: 'error',
                                uploadTask: null
                            })

                        })
                })
        })

    }
    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(() => {
            this.setState({ uploadState: 'done' })
        }).catch(err => {
            console.log(err);
            this.setState({ errors: this.state.errors.concat(err) })

        })
    }
    render() {
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
        return (
            <Segment className="message__form">
                <Input fluid name="message" onChange={this.handleChange} style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left" value={message}
                    className={errors.some(error => error.message.includes("message"))
                        ? "error" : ""} placeholder="write your message" />
                <Button.Group icon widths='2'>
                    <Button color="blue" onClick={this.sendMessage}
                        disabled={loading} content="Add reply" labelPosition="left" icon="edit" />
                    <Button disabled={uploadState === "uploading"} onClick={this.openModal} color="teal" content="Upload Media" labelPosition="right" icon="cloud upload" />
                </Button.Group>
                <FileModal modal={modal}
                    uploadFile={this.uploadFile}
                    closeModal={this.closeModal} />
                <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded} />

            </Segment>
        )
    }
}
export default MessageForm
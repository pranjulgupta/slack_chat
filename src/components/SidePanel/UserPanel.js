import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase';
class UserPanel extends Component {
    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {
            key: "user",
            text: (<span>Signed in as <strong>{this.state.user.displayName}</strong></span>),
            disabled: true
        },
        {
            key: "avatar",
            text: <span>Change Avatar</span>
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignOut}>Sign Out</span>
        }
    ];
    handleSignOut = () => {
        firebase.auth().signOut().then(() => console.log("signed out!")
        );
    }
    render() {
        const { user } = this.state;

        return (
            <Grid style={{ background: "rgb(83, 23, 85)" }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                        <Header inverted floated="left" as="h3">
                            <Icon name="user circle" />
                            <Header.Content>Hello</Header.Content>
                        </Header>
                    </Grid.Row>

                    <Header style={{ padding: '0.25em' }} as="h4" inverted>
                        <Dropdown trigger={<span>
                            <Image src={user.photoURL} spaced="right" avatar />
                            {user.displayName}</span>}
                            options={this.dropdownOptions()} />
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel
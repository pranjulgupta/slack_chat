import React, { Component } from 'react'
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

class MessagesHeader extends Component {


    render() {
        const { channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel } = this.props;
        return (
            <Segment clearing>
                {/* {"channel title"} */}
                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>{channelName}
                        {!isPrivateChannel && <Icon name={"star outline"} size="small" color="black" />}
                    </span>
                    <Header.Subheader><Icon name={"user outline"} />{numUniqueUsers}</Header.Subheader>
                </Header>
                {/*channel search input*/}
                <Header floated="right">
                    <Input loading={searchLoading} size="mini" onChange={handleSearchChange} icon="search" iconPosition="left" name="searchTerm" placeholder="Search Messages" />
                </Header>
            </Segment>
        )
    }
}
export default MessagesHeader
import React, { Component } from 'react'
import { Segment, Header, Accordion, Icon, Image, List } from 'semantic-ui-react';

class MetaPanel extends Component {
    state = {
        activeIndex: 0,
        privateChannel: this.props.isPrivateChannel,
        channel: this.props.currentChannel,
    }
    displayTopPosters = posts =>
        Object.entries(posts).sort((a, b) => b[1] - a[1]).map(([key, val], i) => (
            <List.Item key={i}>
                <Image avatar src={val.avatar} />
                <List.Content>
                    <List.Header as="a">{key}</List.Header>
                    <List.Description>{val.count}posts</List.Description>
                </List.Content>
            </List.Item>
        ))

    setActiveIndex = (event, titleprops) => {
        const { index } = titleprops;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    }
    render() {
        const { activeIndex, privateChannel, channel } = this.state;
        const { userPosts } = this.props;
        if (privateChannel || !channel) return null;
        return (
            <Segment loading={!channel}>
                <Header as="h3" attached="top">
                    About # {channel && channel.name}
                </Header>
                <Accordion styled attached="true">
                    <Accordion.Title
                        active={activeIndex == 0} index={0}
                        onClick={this.setActiveIndex}>
                        <Icon name="dropdown" />
                        <Icon name="info" />
                        channel Details
                        </Accordion.Title>
                    <Accordion.Content active={activeIndex == 0}>
                        {channel && channel.details}
                    </Accordion.Content>
                    <Accordion.Title
                        active={activeIndex == 1} index={1}
                        onClick={this.setActiveIndex}>
                        <Icon name="dropdown" />
                        <Icon name="user circle" />
                        Top posters
                        </Accordion.Title>
                    <Accordion.Content active={activeIndex == 1}>
                        <List>
                            {userPosts && this.displayTopPosters(userPosts)}
                        </List>
                    </Accordion.Content>
                    <Accordion.Title
                        active={activeIndex == 2} index={2}
                        onClick={this.setActiveIndex}>
                        <Icon name="dropdown" />
                        <Icon name="pencil alternate" />
                        Created By
                        </Accordion.Title>
                    <Accordion.Content active={activeIndex == 2}>
                        <Header as="h3">
                            <Image circular src={channel && channel.createdBy.avatar} />
                            {channel && channel.createdBy.name}
                        </Header>
                    </Accordion.Content>
                </Accordion>
            </Segment>
        )
    }
}
export default MetaPanel
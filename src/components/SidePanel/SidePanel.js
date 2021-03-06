import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
class SidePanel extends Component {
    render() {
        const { currentUser } = this.props;
        return (
            <Menu size="large" inverted fixed="left"  className="messages" vertical style={{ background: "rgb(83, 23, 85)", fontSize: "1.2rem" }}>
                <UserPanel currentUser={currentUser} />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />
            </Menu>

        )
    }
}
export default SidePanel
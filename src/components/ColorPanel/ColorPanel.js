import React, { Component } from 'react'
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

class ColorPanel extends Component {
   render() {
      return (
         <Sidebar as={Menu} icon="labeled" inverted vertical visible width="very thin">
            <Divider />
            <Button icon="add" size="small" style={{ backgroundColor: '#676066' }} />
         </Sidebar>
      )
   }
}

export default ColorPanel

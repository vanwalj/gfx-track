'use strict';

import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import VideoCardRow from './video-card-row';
import VideoCardTileSubtitle from './video-card-tile-subtitle';
import emailValidator from 'email-validator';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import FontIcon from 'material-ui/FontIcon';

export default class Layout extends React.Component {
  constructor (props) {
    super(props);
    this.state = { email: null, validEmail: false };
  }
  render () {
    const { videoCards, registration, userAgent, touchedNotificationButton } = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({
            palette: {
              primary1Color: '#76B900',
              primary2Color: '#76B900',
              primary3Color: '#191919',
              accent1Color: '#76B900'
            }
          }, { userAgent })}>
        <div>
          <AppBar showMenuIconButton={false} style={{ position: 'fixed' }} title="GFX Track" />
          <div style={{ paddingTop: 64, paddingBottom: 64 }}>
            <div style={{ padding: 10 }}>
              <Paper style={{ flexDirection: 'column' }}>
                <div>
                  {videoCards.list.map((videoCard, idx) => (
                    <div key={idx}>
                      <VideoCardRow videoCard={videoCard} />
                      <Divider />
                    </div>
                  ))}
                </div>
              </Paper>
            </div>
          </div>
          <Toolbar style={{ position: 'fixed', bottom: 0, width: '100vw', display: 'flex' }} >
            {
              registration.isFetching ?
                <ToolbarGroup>
                  <RefreshIndicator size={40} left={0} top={0} status="loading"/>
                </ToolbarGroup> :
                registration.isComplete ?
                  <ToolbarGroup style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'row', justifyContent: 'center' }}>
                    <FontIcon color={'#76B900'} className="material-icons">check_circle</FontIcon>
                  </ToolbarGroup> :
                    <ToolbarGroup style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'row' }}>
                      <TextField type="email" onChange={(p, val) => this.setState({ email: val, isEmailValid: emailValidator.validate(val) })} hintText="Email" style={{ flex: '1 1 auto' }} />
                      <RaisedButton disabled={!this.state.isEmailValid} label="Activer les notifications" primary={true} onClick={() => touchedNotificationButton(this.state.email)} />
                    </ToolbarGroup>
            }
          </Toolbar>
        </div>
      </MuiThemeProvider>
    );
  }
}

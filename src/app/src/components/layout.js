'use strict';

import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import VideoCardTileSubtitle from './video-card-tile-subtitle';

export default ({ videoCards, userAgent, toggleDrawer, drawerIsOpen }) => (
  <MuiThemeProvider muiTheme={getMuiTheme({
    palette: {
      primary1Color: '#191919',
      primary2Color: '#000000',
      primary3Color: '#FFFFFF',
      accent1Color: '#76B900'
    }
  }, { userAgent })}>
    <div>
      <AppBar onLeftIconButtonTouchTap={toggleDrawer} style={{ position: 'fixed' }} title="GFX Track" />
      <Drawer
        open={drawerIsOpen}
        docked={false}
        onRequestChange={toggleDrawer}
      >
        <Toolbar>
          <ToolbarGroup float="left">
            <ToolbarTitle text="Filtres" />
          </ToolbarGroup>
          <ToolbarGroup float="right">
            <IconButton iconClassName="material-icons">settings_backup_restore</IconButton>
          </ToolbarGroup>
        </Toolbar>
      </Drawer>
    <div style={{ paddingTop: 64 }}>
      <div style={{ margin: '28px 42px' }}>
          <GridList cellHeight={300} >
            {videoCards.list.map((videoCard, idx) => (
              <GridTile
                key={idx}
                title={<span><b>{videoCard.Manufacturer.name}</b> {videoCard.name}</span>}
                subtitle={
                  <VideoCardTileSubtitle videoCard={videoCard} />
                }
              >
                {
                  videoCard.Logos && videoCard.Logos.length ?
                    <img src={videoCard.Logos[0].url} /> :
                    <img src="http://www.material-ui.com/images/grid-list/camera-813814_640.jpg" />
                }
              </GridTile>
            ))}
          </GridList>
        </div>
      </div>
    </div>
  </MuiThemeProvider>
);

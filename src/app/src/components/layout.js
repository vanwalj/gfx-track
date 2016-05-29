'use strict';

import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default props => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <div>
      <AppBar style={{ position: 'fixed' }} title="GFX Track" />
      <div style={{ paddingTop: 64 }}>
        <GridList>
          {props.gfx.list.map((gf, idx) => (
            <GridTile
              key={idx}
              title={gf.title}
              subtitle={<span>by <b>{gf.vendor}</b></span>}
            >
              <img src={gf.img}/>
            </GridTile>
          ))}
        </GridList>
      </div>
    </div>
  </MuiThemeProvider>
);

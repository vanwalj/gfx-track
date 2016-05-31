'use strict';

import React from 'react';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import { toggleNotifications } from '../actions';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Price from './price';

export default connect()(({ dispatch, videoCard }) => (
  <div style={{ display: 'flex' }}>
    <div style={{ padding: 10 }}>
      {
        videoCard.Logos && videoCard.Logos.length ?
          <img style={{ width: '25vw', height: 'auto' }} src={videoCard.Logos[0].url} /> :
          <img src="http://www.material-ui.com/images/grid-list/camera-813814_640.jpg" />
      }
    </div>
    <div style={{ display: 'flex', flex: '1 1 auto', alignItems: 'left', justifyContent: 'center', flexDirection: 'column' }}>
      <div>
        <b>{videoCard.Manufacturer.name}</b>
      </div>
      <div>
        <span>{videoCard.name}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {videoCard.ResellerVideoCards.map((resellerVideoCard, idx) => {
          return (
            <RaisedButton key={idx} linkButton={true} href={resellerVideoCard.url} style={{ margin: 5 }} primary={resellerVideoCard.Probes[0] && resellerVideoCard.Probes[0].inStock}>
              <span style={{ marginLeft: 5, marginRight: 5, fontSize: 10, color: 'black' }}>{resellerVideoCard.Reseller.name}</span>
            </RaisedButton>
          );
        })}
      </div>
    </div>
    <div style={{ padding: 10, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
      <div>
        <Toggle onToggle={() => dispatch(toggleNotifications(videoCard))} toggled={videoCard.notificationsEnabled} style={{ display: 'flex' }} />
      </div>
      <div style={{ paddingLeft: 10 }}>
        <FontIcon color={videoCard.notificationsEnabled ? '#76B900' : '#191919'} className="material-icons">notifications_active</FontIcon>
      </div>
    </div>
  </div>
));

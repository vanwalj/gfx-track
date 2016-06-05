'use strict';

import React from 'react';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import { toggleNotifications } from '../actions';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Price from './price';
import Paper from 'material-ui/Paper';

export default connect()(({ dispatch, videoCard }) => (
  <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
    <div style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
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
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        {videoCard.ResellerVideoCards
          .sort((l, r) => {
            if (!l.Probes[0]) return 1;
            if (!r.Probes[0]) return -1;
            if (l.Probes[0].inStock && !r.Probes[0].inStock) return -1;
            if (r.Probes[0].inStock && !l.Probes[0].inStock) return 1;
            return l.Probes[0].price > r.Probes[0].price;
          })
          .map((resellerVideoCard, idx) => {
            return (
              <Paper style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                <b>{ resellerVideoCard.Probes[0] && resellerVideoCard.Probes[0].price && <Price style={{ lineHeight: 2 }} value={resellerVideoCard.Probes[0].price} /> }</b>
                <RaisedButton key={idx} linkButton={true} href={resellerVideoCard.url} style={{ margin: 5 }} primary={resellerVideoCard.Probes[0] && resellerVideoCard.Probes[0].inStock}>
                  <span style={{ marginLeft: 5, marginRight: 5, fontSize: 10, color: 'black' }}>{resellerVideoCard.Reseller.name}</span>
                </RaisedButton>
              </Paper>
            );
          })
        }
      </div>
    </div>
    <div style={{ padding: 10, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
      <div>
        <Toggle onToggle={() => dispatch(toggleNotifications(videoCard))} toggled={videoCard.notificationsEnabled} style={{ display: 'flex' }} />
      </div>
      <div style={{ paddingLeft: 10 }}>
        <FontIcon color={videoCard.notificationsEnabled ? '#76B900' : '#191919'} className="material-icons">notifications_active</FontIcon>
      </div>
    </div>
  </div>
));

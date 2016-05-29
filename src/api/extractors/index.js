'use strict';

const LDLCExtractor = require('./ldlc');
const AmazonFrExtractor = require('./amazon-fr');
const MaterielPointNetExtractor = require('./materiel-point-net');
const TopachatExtractor = require('./topachat');

// Slug to class
module.exports = {
  ldlc: LDLCExtractor,
  materielPointNet: MaterielPointNetExtractor,
  topachat: TopachatExtractor,
  amazonFr: AmazonFrExtractor
};

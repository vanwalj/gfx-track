'use strict';

const LDLCExtractor = require('./ldlc');
const AmazonFrExtractor = require('./amazon-fr');
const MaterielPointNetExtractor = require('./materiel-point-net');
const TopachatExtractor = require('./topachat');
const GrosbillExtractor = require('./grosbill');
const NvidiaFranceExtractor = require('./nvidia-fr');

// Slug to class
module.exports = {
  ldlc: LDLCExtractor,
  materielPointNet: MaterielPointNetExtractor,
  topachat: TopachatExtractor,
  amazonFr: AmazonFrExtractor,
  grosbill: GrosbillExtractor,
  nvidiaFr: NvidiaFranceExtractor
};

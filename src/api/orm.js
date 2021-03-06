'use strict';

const Sequelize = require('sequelize');

const config = require('./config');

const orm = module.exports = new Sequelize(config.DATABASE_URL, {
  native: true
});

const File = orm.define('File', {
  content: Sequelize.BLOB,
  contentType: Sequelize.STRING,
  contentLength: Sequelize.INTEGER,
  url: {
    type: Sequelize.VIRTUAL,
    get () {
      return `/files/${ this.id }`;
    }
  }
});

const Probe = orm.define('Probe', {
  price: Sequelize.FLOAT,
  inStock: Sequelize.BOOLEAN,
  probedAt: Sequelize.DATE
});

const ResellerVideoCard = orm.define('ResellerVideoCard', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: Sequelize.STRING
});

const Reseller = orm.define('Reseller', {
  name: Sequelize.STRING,
  slug: Sequelize.STRING,
  homeUrl: Sequelize.STRING,
  twitterHandle: Sequelize.STRING
});

const Manufacturer = orm.define('Manufacturer', {
  name: Sequelize.STRING,
  homeUrl: Sequelize.STRING,
  twitterHandle: Sequelize.STRING
});

const VideoCard = orm.define('VideoCard', {
  name: Sequelize.STRING,
  coreClock: Sequelize.INTEGER,
  boostClock: Sequelize.INTEGER,
  memoryClock: Sequelize.INTEGER,
  MPN: Sequelize.STRING,
  EAN: Sequelize.STRING,
  cardWidth: Sequelize.FLOAT,
  cardLength: Sequelize.FLOAT,
  slots: Sequelize.INTEGER,
  cooling: Sequelize.STRING,
  powerInput: Sequelize.STRING
});

const User = orm.define('User', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Reseller.hasOne(File, { as: 'Logo' });
File.belongsTo(Reseller);

Manufacturer.hasOne(File, { as: 'Logo' });
File.belongsTo(Manufacturer);

VideoCard.hasMany(File, { as: 'Logos' });
File.belongsTo(VideoCard);

Manufacturer.hasMany(VideoCard);
VideoCard.belongsTo(Manufacturer);

VideoCard.belongsToMany(Reseller, { through: { model: ResellerVideoCard } });
Reseller.belongsToMany(VideoCard, { through: { model: ResellerVideoCard } });
ResellerVideoCard.belongsTo(Reseller);
Reseller.hasMany(ResellerVideoCard);
ResellerVideoCard.belongsTo(VideoCard);
VideoCard.hasMany(ResellerVideoCard);

ResellerVideoCard.hasMany(Probe);
Probe.belongsTo(ResellerVideoCard);

User.belongsToMany(VideoCard, { through: 'UserVideoCard' });
VideoCard.belongsToMany(User, { through: 'UserVideoCard' });

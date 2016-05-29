'use strict';

const Sequelize = require('sequelize');

const config = require('../config');

const orm = module.exports = new Sequelize(process.env.DB_URL);

const Price = orm.define('Price', {
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE,
  value: Sequelize.FLOAT
});

const ResellerVideoCard = orm.define('ResellerVideoCard', {
  url: Sequelize.STRING
});

const Reseller = orm.define('Reseller', {
  name: Sequelize.STRING
});

const Manufacturer = orm.define('Manufacturer', {
  name: Sequelize.STRING
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

Manufacturer.hasMany(VideoCard);
VideoCard.belongsTo(Manufacturer);
VideoCard.belongsToMany(Reseller, { through: { model: ResellerVideoCard } });
Reseller.belongsToMany(VideoCard, { through: { model: ResellerVideoCard } });
ResellerVideoCard.hasMany(Price);
Price.belongsTo(ResellerVideoCard);

const Sequelize = require('sequelize'),
  conf = require('../config/config.js')['development'],
  db = conf.database,
  host = conf.host,
  port = conf.port,
  username = conf.username,
  password = conf.password,
  dialect = conf.dialect;

const sequelize = new Sequelize(db, username, password, {
  host: host,
  dialect: dialect,
  port: port
});

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};

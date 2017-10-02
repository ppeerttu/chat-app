'use strict';
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
  });

  return User;
};

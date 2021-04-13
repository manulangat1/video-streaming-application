'use strict';
module.exports = (sequelize, DataTypes) => 
{
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nationality: DataTypes.STRING,
    tagline: DataTypes.STRING,
    company: DataTypes.STRING,
    city: DataTypes.STRING,
    token: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
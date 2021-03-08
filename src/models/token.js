'use strict';

const { tokenTypes } = require('../config/tokens');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Token.hasMany(models.User,{
        as:'users',
        foreignKey:'id'
      });
    }
  };
  Token.init({
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
    },
    type: {
      type: DataTypes.STRING,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD],
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};
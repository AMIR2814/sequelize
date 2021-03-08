'use strict';
const { Model } = require('sequelize');
const { paginatePlugin } = require('./plugin/paginate');
const PROTECTED_ATTRIBUTES = ['password', 'token']
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      // hide protected fields
      let attributes = Object.assign({}, this.get())
      for (let a of PROTECTED_ATTRIBUTES) {
        delete attributes[a]
      }
      return attributes
    }

    static async isEmailTaken(email, id = 0) {
      const user = await this.findAndCountAll({ where: { email: email, id: { [Op.ne]: id } } });
      console.log(user.count);
      return user.count != 0;
    }

    static async paginate(filter, options) {
      return await paginatePlugin(this, filter, options);
    }

    // relations
    static associate(models) {

    }
  };

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;

};
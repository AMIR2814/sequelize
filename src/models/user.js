'use strict';
const { Model } = require('sequelize');
const { paginatePlugin } = require('./plugin/paginate');
const PROTECTED_ATTRIBUTES = ['password', 'token']
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

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

    static async isPasswordMatch(password, passwordDB) {
      return bcrypt.compare(password, passwordDB);
    };

    // relations
    static associate(models) {
      User.hasMany(models.Token, {
        as: 'tokens',
        foreignKey: 'user'
      });
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
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  const setSaltAndPassword = async user => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  };
  User.beforeCreate(setSaltAndPassword)
  User.beforeUpdate(setSaltAndPassword)

  return User;
};

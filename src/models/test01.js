'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test01 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Test01.init({
    nama: DataTypes.STRING,
    status: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'Test01',
  });
  return Test01;
};
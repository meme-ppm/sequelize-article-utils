var Sequelize = require('sequelize');

module.exports.model = {
  comment: {type:Sequelize.STRING, allowNull:false},
  isValid  : {type:Sequelize.BOOLEAN, defaultValue:false}
}

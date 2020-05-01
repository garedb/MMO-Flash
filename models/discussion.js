'use strict';
module.exports = (sequelize, DataTypes) => {
  const discussion = sequelize.define('discussion', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  discussion.associate = function(models) {
    models.discussion.belongsTo(models.user)
    models.discussion.hasMany(models.comment)
  };
  return discussion;
};
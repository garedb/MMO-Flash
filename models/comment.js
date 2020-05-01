'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    discussionId: DataTypes.INTEGER
  }, {});
  comment.associate = function(models) {
    models.comment.belongsTo(models.discussion)
  };
  return comment;
};
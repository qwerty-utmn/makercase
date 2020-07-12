module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      user_id: DataTypes.INTEGER,
      artPlace_id: DataTypes.INTEGER,
      text: DataTypes.TEXT,
    },
    {
      freezeTableName: true,
    },
  );

  Comment.associate = function (models) {
    this.belongsTo(models.ArtPlace, { foreignKey: 'artPlace_id', foreignKeyConstraint: true });
    this.belongsTo(models.User, { foreignKey: 'user_id', foreignKeyConstraint: true });

  };
  return Comment;
};

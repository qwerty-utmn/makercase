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
    
  };
  return Comment;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
      name: DataTypes.TEXT,
      photo: DataTypes.TEXT,
    },
    {
      freezeTableName: true,
    },
  );

  User.associate = function (models) {
    this.belongsToMany(models.ArtPlace, {
      through: 'Comment',
      foreignKey: 'user_id',
      as: 'comments',
    });
    this.belongsToMany(models.ArtPlace, {
      through: 'Mark',
      foreignKey: 'user_id',
      as: 'marks',
    });
    this.hasMany(models.Place, {
      foreignKey: 'creator_id'
    })
  };
  return User;
};

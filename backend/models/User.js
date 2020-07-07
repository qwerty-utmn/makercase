module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
      name: DataTypes.TEXT,
      photo: DataTypes.BLOB,
    },
    {
      freezeTableName: true,
    },
  );

  User.associate = function (models) {
  };
  return User;
};
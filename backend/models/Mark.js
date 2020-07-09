module.exports = (sequelize, DataTypes) => {
  const Mark = sequelize.define(
    'Mark',
    {
      user_id: DataTypes.INTEGER,
      artPlace_id: DataTypes.INTEGER,
      mark: DataTypes.INTEGER,
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  Mark.associate = function (models) {
  };
  return Mark;
};

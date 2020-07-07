module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      data: DataTypes.BLOB,
      artPlace_id: DataTypes.INTEGER,
    },
    {
      freezeTableName: true,
    },
  );

  Image.associate = function (models) {
  this.belongsTo(models.ArtPlace, { foreignKey: 'artPlace_id' });
  };

  return Image;
};

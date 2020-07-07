module.exports = (sequelize, DataTypes) => {
  const ArtPlace = sequelize.define(
    'ArtPlace',
    {
      coordinates: {
        type: DataTypes.JSON,
        get() {
          const value = this.getDataValue('coordinates');
          return (value && JSON.parse(value)) || [];
        },
        set(value) {
          this.setDataValue('coordinates', JSON.stringify(value));
        }
      },
      name: DataTypes.TEXT,
      description: DataTypes.TEXT,
      author_name: DataTypes.TEXT,
    },
    {
      freezeTableName: true,
    },
  );


  ArtPlace.associate = function (models) {
  this.hasMany(models.Image, { foreignKey: 'artPlace_id' });
  };
  return ArtPlace;
};


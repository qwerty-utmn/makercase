module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define(
    'Place',
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
      address: DataTypes.TEXT,
      name: DataTypes.TEXT,
      description: DataTypes.TEXT,
      creator_id: DataTypes.INTEGER,
      image: DataTypes.TEXT,
    },
    {
      freezeTableName: true,
    },
  );

  Place.associate = function (models) {
    this.belongsTo(models.User, {
      foreignKey: 'creator_id'
    });
  };
  return Place;
};

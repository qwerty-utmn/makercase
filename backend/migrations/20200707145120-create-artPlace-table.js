module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ArtPlace', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      coordinates: {
        type: Sequelize.JSON,
      },
      name: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      author_name: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => queryInterface.dropTable('ArtPlace'),
};

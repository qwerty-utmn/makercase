module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Image', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      artPlace_id: {
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.BLOB,
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
  down: (queryInterface) => queryInterface.dropTable('Image'),
};

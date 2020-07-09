module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mark', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      artPlace_id: {
        type: Sequelize.INTEGER,
      },
      mark: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Mark'),
};

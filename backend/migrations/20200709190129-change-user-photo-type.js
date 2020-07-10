module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('User', 'photo', Sequelize.TEXT);
  },

  down: (queryInterface, Sequelize) => {
  },
};

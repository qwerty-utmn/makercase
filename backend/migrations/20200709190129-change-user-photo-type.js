module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise(queryInterface.changeColumn('User', 'photo', Sequelize.TEXT));
  },

  down: (queryInterface, Sequelize) => {
  },
};

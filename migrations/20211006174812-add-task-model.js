'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      label: Sequelize.DataTypes.STRING,
      body: Sequelize.DataTypes.STRING,
      done: Sequelize.DataTypes.BOOLEAN,
      id: {type: Sequelize.DataTypes.INTEGER, autoIncrement: true,primaryKey: true },
      createdAt: Sequelize.DataTypes.DATE,
        updatedAt: Sequelize.DataTypes.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tasks');
  }
};

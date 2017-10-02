'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const now = new Date().toUTCString();
    return queryInterface.bulkInsert('Users', [{
      userName: 'TestUser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.tt',
      password: 'Sample1234',
      createdAt: now,
      updatedAt: now
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('Users', null, {});

  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Lakshya Dhingra',
        email: 'dhingralakshya290@gmail.com',
        password: '$2b$12$OQ7Qk2A2iB0c6r6f8Ck6bO1ZzR1Y1R9x8q6X9E1wL8F0Q2nV0wG8q',
        role: 'host',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

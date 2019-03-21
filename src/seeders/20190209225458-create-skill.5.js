module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', [{
      id: 501,
      attributeId: 5,
      name: 'Focus & Concentration'
    }, {
      id: 502,
      attributeId: 5,
      name: 'Expectations Management\u1d47'
    }], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills', null, {})
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', [{
      id: 201,
      attributeId: 2,
      name: 'Business Tools'
    }, {
      id: 202,
      attributeId: 2,
      name: 'Scoping and estimation\u1d47'
    }, {
      id: 203,
      attributeId: 2,
      name: 'Project Management Tools\u1d47'
    }], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills', null, {})
};

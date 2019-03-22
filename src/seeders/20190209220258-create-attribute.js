module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Attributes', [{
      id: 1,
      name: 'Quality'
    }, {
      id: 2,
      name: 'Quantity'
    }, {
      id: 3,
      name: 'Initiative'
    }, {
      id: 4,
      name: 'Communication'
    }, {
      id: 5,
      name: 'Professionalism'
    }, {
      id: 6,
      name: 'Integration'
    }], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Attributes', null, {})
};

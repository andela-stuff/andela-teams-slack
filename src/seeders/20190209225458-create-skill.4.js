module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', [{
      id: 401,  
      attributeId: 4,
      name: 'Willingness to Ask Questions'
    }, {
      id: 402,
      attributeId: 4,
      name: 'Seeks & Requests Feedback'
    }, {
      id: 403,
      attributeId: 4,
      name: 'Writing Professionally'
    }, {
      id: 404,
      attributeId: 4,
      name: 'Speaking to be Understood'
    }, {
      id: 405,
      attributeId: 4,
      name: 'Reading to Understand'
    }, {
      id: 406,
      attributeId: 4,
      name: 'Active Listening'
    }, {
      id: 407,
      attributeId: 4,
      name: 'Stakeholder Management'
    }, {
      id: 408,
      attributeId: 4,
      name: 'Communication Tools'
    }], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills', null, {})
};

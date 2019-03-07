module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', [{
      id: 301,  
      attributeId: 3,
      name: 'Creativity'
    }, {
      id: 302,
      attributeId: 3,
      name: 'Decision Making'
    }, {
      id: 303,
      attributeId: 3,
      name: 'Motivation & Commitment'
    }, {
      id: 304,
      attributeId: 3,
      name: 'Problem Solving & Critical Thinking'
    }, {
      id: 305,
      attributeId: 3,
      name: 'Holistic/Big Picture Thinking\u1d47'
    }], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills', null, {})
};

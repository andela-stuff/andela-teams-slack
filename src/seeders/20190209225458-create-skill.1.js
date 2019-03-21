module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', [{
      id: 101,  
      attributeId: 1,
      name: 'Attention to Detail'
    }, {
      id: 102,
      attributeId: 1,
      name: 'Algorithms'
    }, {
      id: 103,
      attributeId: 1,
      name: 'Date Structures'
    }, {
      id: 104,
      attributeId: 1,
      name: 'Test-Driven Development'
    }, {
      id: 105,
      attributeId: 1,
      name: 'Discrete Math'
    }, {
      id: 106,  
      attributeId: 1,
      name: 'Order of Operations'
    }, {
      id: 107,
      attributeId: 1,
      name: 'Object-Oriented Programming'
    }, {
      id: 108,
      attributeId: 1,
      name: 'HTML/CSS'
    }, {
      id: 109,
      attributeId: 1,
      name: 'Version control'
    }, {
      id: 110,
      attributeId: 1,
      name: 'Patterns (MVC)\u1d47'
    }, {
      id: 111,
      attributeId: 1,
      name: '2 & 3 Tier Architecture\u1d47'
    }, {
      id: 112,
      attributeId: 1,
      name: 'Security\u1d47'
    }, {
      id: 113,
      attributeId: 1,
      name: 'Databases\u1d47'
    }, {
      id: 114,
      attributeId: 1,
      name: 'APIs\u1d47'
    }, {
      id: 115,
      attributeId: 1,
      name: 'UI/UX\u1d47'
    }, {
      id: 116,
      attributeId: 1,
      name: 'End-to-End Testing\u1d47'
    }, {
      id: 117,
      attributeId: 1,
      name: 'Debugging\u1d47'
    }, {
      id: 118,
      attributeId: 1,
      name: 'Agile Process\u1d47'
    }, {
      id: 119,
      attributeId: 1,
      name: 'Proper use of environments\u1d47'
    }, {
      id: 120,
      attributeId: 1,
      name: 'Mobile Development\u1d47'
    }], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills', null, {})
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('FeedbackInstances', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      context: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      from: {
        allowNull: false,
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      skillId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Skills',
          key: 'id',
          as: 'skillId',
        },
      },
      to: {
        allowNull: true,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'negative'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('FeedbackInstances')
};

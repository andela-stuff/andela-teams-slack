export default (sequelize, DataTypes) => {
  const Feedback = sequelize.define('FeedbackInstance', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    context: {
      allowNull: true,
      type: DataTypes.TEXT('long')
    },
    from: {
      allowNull: false,
      type: DataTypes.STRING
    },
    message: {
      allowNull: false,
      type: DataTypes.TEXT('long')
    },
    skillId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'negative'
    }
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Skill, {
      as: 'skill',
      foreignKey: 'skillId',
      onDelete: 'CASCADE'
    });
  };

  Feedback.hook('afterCreate', (feedback, options) => {
    // delete feedback instances older than 4 months (120 days)
    return Feedback.destroy({
      where: {
        createdAt: { $lt: new Date(new Date() - 120 * 24 * 60 * 60 * 1000) }
      }
    })
  });

  return Feedback;
};

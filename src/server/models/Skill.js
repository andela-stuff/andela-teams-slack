export default (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    attributeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Attributes',
        key: 'id',
        as: 'attributeId',
      },
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });

  Skill.associate = (models) => {
    Skill.belongsTo(models.Attribute, {
      as: 'attribute',
      foreignKey: 'attributeId',
      onDelete: 'CASCADE'
    });
  };

  return Skill;
};

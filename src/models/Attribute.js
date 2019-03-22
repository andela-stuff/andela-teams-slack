export default (sequelize, DataTypes) => {
  const Attribute = sequelize.define('Attribute', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });

  Attribute.associate = (models) => {
    Attribute.hasMany(models.Skill, {
      as: 'skills',
      foreignKey: 'attributeId',
    });
  };

  return Attribute;
};

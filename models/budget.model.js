// models/Budget.js
import { DataTypes } from 'sequelize';
import sequelize, { sequelizeConfig } from '../sequelize.js'; 

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  lastAlertSent: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, sequelizeConfig("budgets"));

// Budget.associate = (models) => {
//   Budget.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
// };

export default Budget;

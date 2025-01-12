// models/Transaction.js

import { DataTypes } from 'sequelize';
import sequelize, { sequelizeConfig } from '../sequelize.js'; 
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('INCOME', 'EXPENSE'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurringInterval: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
    allowNull: true,
  },
  nextRecurringDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastProcessed: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
    defaultValue: 'COMPLETED',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, sequelizeConfig("transactions"));

// Transaction.associate = (models) => {
//   Transaction.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
//   Transaction.belongsTo(models.Account, { foreignKey: 'accountId', onDelete: 'CASCADE' });
// };

export default Transaction;

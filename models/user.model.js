// models/User.js

import { DataTypes } from 'sequelize';
import sequelize, { sequelizeConfig } from '../sequelize.js'; 

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    // unique: true,
    allowNull: false,  
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,  
  },  
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,  
  },  
  transactions: {
    type: DataTypes.TEXT("long"),
    allowNull: true,  
  },  
  accounts: {
    type: DataTypes.TEXT("long"),
    allowNull: true,  
  },
  budget: {
    type: DataTypes.TEXT("long"),
    allowNull: true,  
  },

 
}, sequelizeConfig("users"));

// User.associate = (models) => {
//   User.hasMany(models.Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
//   User.hasMany(models.Account, { foreignKey: 'userId', onDelete: 'CASCADE' });
//   User.hasOne(models.Budget, { foreignKey: 'userId', onDelete: 'CASCADE' });
// };


export default User;

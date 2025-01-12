// models/Account.js
import { DataTypes } from 'sequelize';
import sequelize, { sequelizeConfig } from '../sequelize.js'; 

// id           String        @id @default(uuid())
//   name         String
//   type         AccountType
//   balance      Decimal       @default(0) // will ask inital balance while creating an account
//   isDefault    Boolean       @default(false)
//   userId       String
//   user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
//   transactions Transaction[]
//   createdAt    DateTime      @default(now())
//   updatedAt    DateTime      @updatedAt

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('CURRENT', 'SAVINGS'),
    allowNull: true,
  },
  balance: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  transactions: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
}, sequelizeConfig("accounts"));

// Account.associate = (models) => {
//   Account.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
//   Account.hasMany(models.Transaction, { foreignKey: 'accountId', onDelete: 'CASCADE' });
// };

export default Account;

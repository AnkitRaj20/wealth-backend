import { Sequelize } from 'sequelize';

// Create a new Sequelize instance
const sequelize = new Sequelize('defaultdb', 'avnadmin', 'AVNS_PgaQ8cdTSg0-Nu7PA9Q', {
  host: 'mysql-207c0891-ankitraja177-b9d5.c.aivencloud.com',
  dialect: 'mysql',
  port: 22658,         // MySQL port (default is 3306, change if needed)
  pool: {
    max: 5,   // Maximum number of connections in the pool
    min: 0,           // Minimum number of connections in the pool
    acquire: 30000,   // Max time (in ms) for acquiring a connection from the pool
    idle: 10000       // Max time (in ms) a connection can be idle before being released
  }
});

export default sequelize;


// Function to check the connection
 const checkConnection = async () => {
    try {
      // Test connection by authenticating
      await sequelize.authenticate();
      console.log('Connection to the MySQL database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the MySQL database:', error);
    }
  };
  
  // Run the check
export const db =  checkConnection();

export const sequelizeConfig = (tableName) => {
  return {
    timestamps: true,
    tableName: tableName,
    paranoid: true,
    underscored: true, //
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  };
};
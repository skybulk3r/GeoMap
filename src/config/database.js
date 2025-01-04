const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'drone_db',
  logging: false
});

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    await sequelize.sync();
    console.log('Database models synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  setupDatabase
};
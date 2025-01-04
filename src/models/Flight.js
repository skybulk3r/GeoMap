const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Flight = sequelize.define('Flight', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  droneId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE
  },
  flightPath: {
    type: DataTypes.GEOMETRY('LINESTRING'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('planned', 'in-progress', 'completed', 'aborted'),
    defaultValue: 'planned'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

module.exports = Flight;
const { sequelize } = require('../../config/database');
const { DataTypes } = require('sequelize');

const LidarData = sequelize.define('LidarData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  flightId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  pointCloud: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  summary: {
    type: DataTypes.JSONB,
    allowNull: false
  }
});

async function saveLidarData(flightId, processedData) {
  return await LidarData.create({
    flightId,
    pointCloud: processedData.pointCloud,
    summary: processedData.summary
  });
}

async function getLidarData(flightId) {
  return await LidarData.findOne({
    where: { flightId },
    attributes: ['pointCloud', 'summary']
  });
}

module.exports = { saveLidarData, getLidarData };
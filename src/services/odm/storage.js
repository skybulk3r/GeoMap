const { sequelize } = require('../../config/database');
const { DataTypes } = require('sequelize');

const ProcessingTask = sequelize.define('ProcessingTask', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  flightId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  taskId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('processing', 'completed', 'failed'),
    defaultValue: 'processing'
  },
  results: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

async function saveProcessingTask(flightId, taskData) {
  return await ProcessingTask.create({
    flightId,
    ...taskData
  });
}

async function updateTaskStatus(taskId, status, results = {}) {
  return await ProcessingTask.update(
    { status, results },
    { where: { taskId } }
  );
}

module.exports = {
  ProcessingTask,
  saveProcessingTask,
  updateTaskStatus
};
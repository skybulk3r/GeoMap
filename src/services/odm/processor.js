const odmClient = require('./client');
const { saveProcessingTask } = require('./storage');

async function processImagery(flightId, images, options = {}) {
  try {
    // Create ODM project
    const project = await odmClient.createProject(`flight-${flightId}`);
    
    // Upload images
    await odmClient.uploadImages(project.id, images);
    
    // Start processing
    const task = await odmClient.processProject(project.id, {
      dsm: true,
      orthophoto: true,
      ...options
    });
    
    // Save task information
    await saveProcessingTask(flightId, {
      projectId: project.id,
      taskId: task.id,
      status: 'processing'
    });

    return {
      projectId: project.id,
      taskId: task.id
    };
  } catch (error) {
    throw new Error(`ODM processing failed: ${error.message}`);
  }
}

async function checkProcessingStatus(projectId) {
  return await odmClient.getProjectStatus(projectId);
}

module.exports = {
  processImagery,
  checkProcessingStatus
};
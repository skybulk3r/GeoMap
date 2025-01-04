const fetch = require('node-fetch');
const FormData = require('form-data');
const { ODM_API_URL } = require('../../config/constants');

class ODMClient {
  async createProject(name) {
    const response = await fetch(`${ODM_API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return response.json();
  }

  async uploadImages(projectId, images) {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image.buffer, image.originalname);
    });

    const response = await fetch(`${ODM_API_URL}/projects/${projectId}/upload`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  async processProject(projectId, options = {}) {
    const response = await fetch(`${ODM_API_URL}/projects/${projectId}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    return response.json();
  }

  async getProjectStatus(projectId) {
    const response = await fetch(`${ODM_API_URL}/projects/${projectId}`);
    return response.json();
  }
}

module.exports = new ODMClient();
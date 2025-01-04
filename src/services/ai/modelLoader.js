const tf = require('@tensorflow/tfjs-node');

class ModelLoader {
  constructor() {
    this.model = null;
    this.labels = null;
  }

  async loadModel(modelPath) {
    try {
      this.model = await tf.loadGraphModel(modelPath);
      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  async loadLabels(labelsPath) {
    try {
      const response = await fetch(labelsPath);
      this.labels = await response.json();
      return true;
    } catch (error) {
      console.error('Error loading labels:', error);
      throw error;
    }
  }

  getModel() {
    if (!this.model) {
      throw new Error('Model not loaded');
    }
    return this.model;
  }

  getLabels() {
    if (!this.labels) {
      throw new Error('Labels not loaded');
    }
    return this.labels;
  }
}

module.exports = new ModelLoader();
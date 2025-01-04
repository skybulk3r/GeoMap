const tf = require('@tensorflow/tfjs-node');
const modelLoader = require('./modelLoader');
const { preprocessImage, nonMaxSuppression } = require('./imageProcessor');

class DamageDetector {
  constructor() {
    this.confidenceThreshold = 0.5;
  }

  async detect(imageBuffer) {
    try {
      const model = modelLoader.getModel();
      const input = await preprocessImage(imageBuffer);
      
      // Run inference
      const predictions = await model.predict(input);
      
      // Process predictions
      const [boxes, scores, classes] = this.processPredictions(predictions);
      
      // Apply NMS
      const selectedIndices = await nonMaxSuppression(boxes, scores);
      
      // Format results
      return this.formatResults(selectedIndices, boxes, scores, classes);
    } catch (error) {
      console.error('Detection error:', error);
      throw error;
    } finally {
      // Cleanup tensors
      tf.dispose();
    }
  }

  processPredictions(predictions) {
    const boxes = predictions[0];
    const scores = predictions[1];
    const classes = predictions[2];
    
    return [
      boxes,
      scores.squeeze(),
      classes.squeeze()
    ];
  }

  formatResults(indices, boxes, scores, classes) {
    const labels = modelLoader.getLabels();
    return Array.from(indices).map(index => ({
      bbox: Array.from(boxes.slice([index, 0], [1, 4]).dataSync()),
      score: scores.dataSync()[index],
      class: labels[classes.dataSync()[index]],
    })).filter(result => result.score >= this.confidenceThreshold);
  }
}

module.exports = new DamageDetector();
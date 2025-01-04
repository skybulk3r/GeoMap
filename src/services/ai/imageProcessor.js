const sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');

async function preprocessImage(imageBuffer) {
  // Resize image to model input size
  const resized = await sharp(imageBuffer)
    .resize(416, 416) // Standard YOLO input size
    .toBuffer();

  // Convert to tensor
  const tensor = tf.node.decodeImage(resized, 3);
  
  // Normalize pixel values
  const normalized = tensor.div(255.0);
  
  // Add batch dimension
  return normalized.expandDims(0);
}

async function nonMaxSuppression(boxes, scores, maxBoxes = 100, iouThreshold = 0.5) {
  return await tf.image.nonMaxSuppressionAsync(
    boxes,
    scores,
    maxBoxes,
    iouThreshold
  );
}

module.exports = {
  preprocessImage,
  nonMaxSuppression
};
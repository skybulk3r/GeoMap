const turf = require('@turf/turf');

async function processLidarData(data) {
  const { points, metadata } = data;
  
  // Convert points to GeoJSON
  const pointFeatures = points.map(point => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [point.x, point.y, point.z]
    },
    properties: {
      intensity: point.intensity
    }
  }));

  // Create point cloud collection
  const pointCloud = {
    type: 'FeatureCollection',
    features: pointFeatures,
    properties: {
      timestamp: metadata.timestamp,
      resolution: metadata.resolution,
      sensor: metadata.sensor
    }
  };

  // Calculate basic statistics
  const summary = {
    pointCount: points.length,
    bounds: turf.bbox(pointCloud),
    averageIntensity: calculateAverageIntensity(points),
    timestamp: metadata.timestamp
  };

  return {
    pointCloud,
    summary
  };
}

function calculateAverageIntensity(points) {
  const sum = points.reduce((acc, point) => acc + (point.intensity || 0), 0);
  return points.length > 0 ? sum / points.length : 0;
}

module.exports = { processLidarData };
const mqtt = require('mqtt');

class MQTTClient {
  constructor() {
    this.client = null;
  }

  connect() {
    this.client = mqtt.connect('mqtt://localhost:1883');
    
    this.client.on('connect', () => {
      console.log('MQTT client connected');
      this.client.subscribe('drone/+/telemetry');
      this.client.subscribe('drone/+/status');
    });

    this.client.on('error', (error) => {
      console.error('MQTT connection error:', error);
    });
  }

  publish(topic, message) {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }
    this.client.publish(topic, JSON.stringify(message));
  }
}

module.exports = new MQTTClient();
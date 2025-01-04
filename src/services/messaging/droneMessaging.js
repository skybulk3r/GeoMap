const mqttClient = require('../mqtt/client');
const rabbitClient = require('../rabbitmq/client');

class DroneMessaging {
  async initialize() {
    mqttClient.connect();
    await rabbitClient.connect();
    this.setupMessageHandlers();
  }

  setupMessageHandlers() {
    // Handle flight updates from RabbitMQ
    rabbitClient.consumeFlightUpdates(async (update) => {
      // Publish telemetry updates via MQTT
      if (update.type === 'telemetry') {
        mqttClient.publish(`drone/${update.droneId}/telemetry`, update.data);
      }
    });
  }

  async sendDroneCommand(droneId, command) {
    await rabbitClient.sendCommand({
      droneId,
      command,
      timestamp: new Date().toISOString()
    });
  }

  publishTelemetry(droneId, telemetry) {
    mqttClient.publish(`drone/${droneId}/telemetry`, telemetry);
  }
}

module.exports = new DroneMessaging();
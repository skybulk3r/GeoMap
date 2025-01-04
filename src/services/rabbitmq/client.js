const amqp = require('amqplib');

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      
      // Declare queues
      await this.channel.assertQueue('drone_commands', { durable: true });
      await this.channel.assertQueue('flight_updates', { durable: true });
      
      console.log('RabbitMQ connected');
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
      throw error;
    }
  }

  async sendCommand(command) {
    if (!this.channel) {
      throw new Error('RabbitMQ not connected');
    }
    this.channel.sendToQueue('drone_commands', Buffer.from(JSON.stringify(command)));
  }

  async consumeFlightUpdates(callback) {
    if (!this.channel) {
      throw new Error('RabbitMQ not connected');
    }
    await this.channel.consume('flight_updates', (msg) => {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      this.channel.ack(msg);
    });
  }
}

module.exports = new RabbitMQClient();
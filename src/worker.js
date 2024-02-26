const rabbitMQUrl = 'amqp://localhost';
const queueName = 'qtest1';

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
}

let channel;
connectToRabbitMQ()
  .then((ch) => {
    channel = ch;
    console.log('Connected to RabbitMQ');
  })
  .catch((error) => {
    console.error('Failed to connect to RabbitMQ:', error);
  });

module.exports = { channel, queueName };

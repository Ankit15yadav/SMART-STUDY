import { Kafka, Producer } from "kafkajs"
import fs from "fs"
import path from "path"
import { db } from "@/server/db"

interface KafkaMessage {
    groupId: any;
    senderId: any;
    content: any;
    createdAt: string;

}

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER!],
    ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")]
    },
    sasl: {
        username: 'avnadmin',
        password: process.env.KAFKA_PASSWORD!,
        mechanism: 'plain'
    }
})

let producer: null | Producer = null;

export async function createProducer() {
    if (producer) return producer;

    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message: string) {
    const values = JSON.parse(message);

    // console.log("kafka values", values);
    const producer = await createProducer();

    await producer.send({
        messages: [
            { key: `message-${Date.now()}`, value: JSON.stringify(values) }
        ],
        topic: 'MESSAGES'
    })

    return true;
}

export async function startMessageConsumer() {
    console.log("consumer is running...");
    const consumer = kafka.consumer({ groupId: 'default' });
    await consumer.connect();

    // Correct the topic name to match producer's 'MESSAGES'
    await consumer.subscribe({ topic: 'MESSAGES', fromBeginning: true });

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ message, pause }) => {
            if (!message.value) return;

            try {
                // Parse the message
                const messageData = JSON.parse(message.value.toString());

                // console.log(messageData);

                // Validate required fields
                if (!messageData.groupId || !messageData.senderId || !messageData.content) {
                    throw new Error("Invalid message format");
                }

                // Create message in database
                await db.message.create({
                    data: {
                        content: messageData.content,
                        groupId: messageData.groupId,
                        senderId: messageData.senderId,
                        createdAt: messageData.createdAt ? new Date(messageData.createdAt) : undefined,
                    }
                });

                // console.log(`Message stored: ${messageData.content}`);
            } catch (error) {
                console.error("Error processing message:", error);
                pause(); // Pause consumer on error
                setTimeout(() => consumer.resume([{ topic: 'MESSAGES' }]), 60_000); // Retry after 60 seconds
            }
        }
    });
}

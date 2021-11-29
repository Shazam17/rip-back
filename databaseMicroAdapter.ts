import DatabaseAdapter from "./src/DatabaseAdapter";
import {RabbitMQEvents} from "./src/EventTypes";
import amqp from "amqplib/callback_api";

const db = new DatabaseAdapter()
const docker ="amqp://admin:password@" + process.env.RABBIT_HOST;
const local ="amqp://admin:password@localhost"
amqp.connect(docker, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log("success access")
    connection.createChannel((error1, channel)  => {
        if (error1) {
            throw error1;
        }
        const queue = 'taskQueue';
        const queueIn = 'taskQueueIn';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.assertQueue(queueIn, {
            durable: false
        });

        channel.consume(queue, async (msg) => {
            const msgParsed = JSON.parse(msg.content)

            if(msgParsed.event === RabbitMQEvents.CREATE_TASK){
                const {label, body, done} = msgParsed.data
                const res = await db.createTask(label,body,done)
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(res)))
            }
            if(msgParsed.event === RabbitMQEvents.MARK_DONE){
                const {id, done} = msgParsed.data
                const res = await db.markDone(id, done)
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(res)))
            }
            if(msgParsed.event === RabbitMQEvents.DELETE_TASK){
                const {id} = msgParsed.data
                const res = await db.deleteTask(id)
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(res)))
            }

        }, {
            noAck: true
        });
    });


});


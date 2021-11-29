import amqp from "amqplib/callback_api";

export default class RabbitmqAdapter {

    connection: object;
    channel: object;
    queue = 'taskQueue';
    queueIn = 'taskQueueIn';
    constructor() {
        try{
            const docker ="amqp://admin:password@" + process.env.RABBIT_HOST;
            const local ="amqp://admin:password@localhost"
            amqp.connect(docker, (error0, connection) =>  {
                if (error0) {
                    throw error0;
                }

                this.connection = connection;
                connection.createChannel((error1, channel) => {
                    if (error1) {
                        throw error1;
                    }

                    channel.assertQueue(this.queue, {
                        durable: false
                    });
                    this.channel = channel;
                    channel.consume(this.queue, async (msg) => {
                        const msgParsed = JSON.parse(msg.content)
                        console.log(msgParsed)
                    })
                });

            });
        }catch (e) {
            console.log("rabbitmq exception")
            console.log(e)
        }
    }

    async sendEvent(event, data){
        const msg = JSON.stringify({event, data})
        // @ts-ignore
        this.channel.sendToQueue(this.queue, Buffer.from(msg));
    }


    close(){
        console.log('close')
        // @ts-ignore
        this.connection.close();
    }
}

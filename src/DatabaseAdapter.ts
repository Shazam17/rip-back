import {Task} from "../models/Task";


export default class DatabaseAdapter {

    constructor() {

    }

    async getTasks(){
        const tasks = await Task.findAll()
        return tasks;
    }

    async createTask(label: string, body: string, done: boolean){
        return await Task.create({
            done: !!done,
            label,
            body
        })
    }

    async markDone(id: number, done: boolean){
        const task = await Task.findOne({
            where: {
                id
            }
        })
        task.done = done;
        return await task.save()

    }

    async deleteTask(id){
        const task = await Task.findOne({
            where: {
                id
            }
        })
        if(task){
            await task.destroy()
        }
    }

}

import express from 'express';
import cookieParser from 'cookie-parser';
import logger  from 'morgan';
import http from "http";
import {indexRouter} from "./routes";
import {tasksRouter} from "./routes/tasks";
import { Server } from "socket.io";
import cors from "cors";
import {WSEventes} from "./src/EventTypes";
import DatabaseAdapter from "./src/DatabaseAdapter";
const io = new Server(8081, {
    cors: {
        origin: "*",
        allowedHeaders: ['Access-Control-Allow-Origin']
    }
});


const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/task', tasksRouter);

const dbProvider = new DatabaseAdapter()

io.on("connection", async (socket) => {
    console.log('connected')


    socket.on(WSEventes.CREATE_TASK, async (data) => {
        const {done, label, body} = data;
        const res = await dbProvider.createTask(label, body, done)
        socket.emit(WSEventes.CREATE_TASK, res)
    })

    socket.on(WSEventes.MARK_DONE, async (data) => {
        const {done, id} = data;
        const res = await dbProvider.markDone(id, done)
        socket.emit(WSEventes.MARK_DONE, res)
    })

    socket.on(WSEventes.DELETE_TASK, async (data) => {
        const {id} = data;
        const res = await dbProvider.deleteTask(id)
        socket.emit(WSEventes.DELETE_TASK, res)
    })
});

const server = http.createServer(app);
server.listen('8080');


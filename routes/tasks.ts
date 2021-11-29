import express from "express";
import {ErrorCatchedResponse, SuccessJsonResponse} from "../src/responses";
import {Task} from "../models/Task";
import RabbitmqAdapter from "../src/RabbitmqAdapter";
import {RabbitMQEvents} from "../src/EventTypes";

import jwt from "jsonwebtoken";

const TOKEN_KEY = "TOKENHAHASOSECRET"
const adapterMQ = new RabbitmqAdapter();
const router = express.Router();

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send(new ErrorCatchedResponse("A token is required for authentication"));
    }
    try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send(new ErrorCatchedResponse("Invalid Token"));
    }
    return next();
};


router.post('/auth', async (req, res) => {
    const token = jwt.sign(
        {data: Math.floor(Math.random() * 1000)},
        TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    res.json(new SuccessJsonResponse({token}))
})

router.get('/get-all', async (req, res) => {
    try{
        const tasks = await Task.findAll()
        res.json(new SuccessJsonResponse(tasks))
    }catch (e) {
        res.json(new ErrorCatchedResponse(e))
    }
})

router.get('/get', async (req, res) => {
    try{

    const {id} = req.query;
        const task = await Task.findOne({
            where: {
                id
            }
        })
        res.json(new SuccessJsonResponse(task))
    }catch (e) {
        res.json(new ErrorCatchedResponse(e))
    }
})

router.post('/create', async (req, res) => {
    try{
        const {done, label, body} = req.body;
        await adapterMQ.sendEvent(RabbitMQEvents.CREATE_TASK,{done,label,body})
        res.json(new SuccessJsonResponse({}))
    }catch (e) {
        res.json(new ErrorCatchedResponse(e))
    }
})

router.post('/mark', async (req, res) => {
    try{
        const {id, done} = req.body;
        await adapterMQ.sendEvent(RabbitMQEvents.MARK_DONE,{id, done})
        res.json(new SuccessJsonResponse({}))
    }catch (e) {
        res.json(new ErrorCatchedResponse(e))
    }
})

router.put('/edit', async (req, res) => {
    try{
        const {id, done, label, body} = req.body;
        const task = await Task.findOne({
            where: {
                id
            }
        })
        task.done = done;
        task.label = label;
        task.body = body;

        await task.save()
        res.json(new SuccessJsonResponse(task))

    }catch (e) {
        res.json(new ErrorCatchedResponse(e))
    }
})

router.delete('/delete', async (req, res) => {
    try{
        const {id} = req.body;
        await adapterMQ.sendEvent(RabbitMQEvents.DELETE_TASK,{id})
        res.json(new SuccessJsonResponse({}))
    }catch (e) {
        res.json(new ErrorCatchedResponse(e))
    }
})

export const tasksRouter = router;


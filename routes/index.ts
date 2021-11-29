import {HealthCheckResponse} from '../src/responses';

import express from "express";

const router = express.Router();

router.get('/', async (req, res) => {
    res.json(new HealthCheckResponse())
})

export const indexRouter = router;


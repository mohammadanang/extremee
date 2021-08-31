import express, { Request, Response } from "express";
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from "cors";
import dotenv from "dotenv";
import debug from 'debug';
import { CommonRoutes } from './config/common.route';
import { UserRoutes } from './modules/users/user.route';

const app: express.Application = express();
dotenv.config();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT;
const routes: Array<CommonRoutes> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [ new winston.transports.Console() ],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if(!process.env.DEBUG) {
    loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UserRoutes(app));

const runningMessage = `Server running at http://localhost:${PORT}`;
app.get("/", (req: Request, res: Response) => {
    res.status(200).send(runningMessage);
});

server.listen(PORT, () => {
    routes.forEach((route: CommonRoutes) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});

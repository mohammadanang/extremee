import express, { Request, Response } from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import dotenv from 'dotenv';
import debug from 'debug';
import { CommonRoutes } from './common/common.route';
import { UserRoutes } from './modules/users/user.route';
import { AuthRoutes } from './modules/auth/auth.route';
import helmet from 'helmet';

const dotEnvResult = dotenv.config();
if(dotEnvResult.error) {
    throw dotEnvResult.error;
}

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT: any = process.env.PORT;
const routes: Array<CommonRoutes> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(helmet());

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
    // if(typeof global.it === 'function') {
    //     loggerOptions.level = 'http';
    // }
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));

const runningMessage = `Server running at http://localhost:${PORT}`;
app.get('/', (req: Request, res: Response) => {
    res.status(200).send(runningMessage);
});

export default server.listen(PORT, () => {
    routes.forEach((route: CommonRoutes) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});

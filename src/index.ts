import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import consola from "consola";
import bodyparser from "body-parser";
import morgan from "morgan";
import createError from "http-errors";
import SERVER_RUNNING_MESSAGE from "./constants/index";
import * as Auth from "./Authentication/Login/index";

dotenv.config();

const Server: Express = express();

const { PORT } = process.env;
const ServerPort = PORT || 5000;

const { LoginStudent, LoginAdministrator } = Auth;

// using body-parser for parsing incoming request bodies to the Express Middlewares
Server.use(bodyparser.urlencoded({ extended: false }));

// an express middleware for parsing incoming request loggers for a good visualization
// on api Routes of the Server
Server.use(morgan("dev"));

Server.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is Express + TypeScript");
});

Server.get("/login", LoginStudent);

Server.post("/register", LoginAdministrator);

const ServerStartup = async (message: string) => {
  try {
    Server.listen(ServerPort, () => {
      consola.info({
        message: `🚀⚡️[server]: ${message} http://localhost:${ServerPort}`,
      });
    });
  } catch (err) {
    throw new Error(`getting error at ${err}`);
  } finally {
    consola.info({
      message: "the Server is launching",
    });
  }
};

ServerStartup(SERVER_RUNNING_MESSAGE);

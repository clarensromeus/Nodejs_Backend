// external imports of sources
import * as dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import consola from "consola";
import bodyparser from "body-parser";
import morgan from "morgan";
import createError from "http-errors";
import cors from "cors";
// internal crafted imports of sources
import SERVER_RUNNING_MESSAGE from "./constants/index";
import * as Auth from "./Authentication/Stud_Admin_Auth/index";
import { tokenAuth } from "./utils/Auth";
import { IGetUserAuthInfoRequest } from "./Assets/globalTypes";

dotenv.config();

const Server: Express = express();

const { PORT } = process.env;
const ServerPort = PORT || 5000;

const {
  StudentRegister,
  AdminRegister,
  StudentLogin,
  tokenVerification,
  studentInfo,
} = Auth;

// using body-parser for parsing incoming request bodies to the Express Middlewares
Server.use(bodyparser.urlencoded({ extended: true }));
Server.use(bodyparser.json());
// using cors for CROSS ORIGIN RESSOURCES SHARING between the server
// and the client securely
Server.use(cors());
// an express middleware for parsing incoming request loggers for a good visualization
// on api Routes of the Server
Server.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

Server.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is Express + TypeScript");
});
Server.post("/gettoken", tokenVerification);
Server.post("/login/student", StudentLogin);
//Server.post("/login/admin");
Server.post("/register/:status", StudentRegister);
Server.post(
  "/student/:id",
  (req: Request, res: Response, next: NextFunction) => {
    res
      .status(400)
      .json({ username: req.body.username, password: req.body.password });
  }
);
//Server.post("/register/admin/:status", AdminRegister);
// Server.get("studentinfo", studentInfo);

const ServerStartup = async (message: string) => {
  try {
    Server.listen(ServerPort, () => {
      consola.info({
        message: `🚀⚡️[server]: ${message} http://localhost:${ServerPort}`,
      });
    });
  } catch (err) {
    throw createError.Conflict(`error is at ${err}`);
  } finally {
    consola.info({
      message: "Server is launching",
    });
  }
};

/* 
    const options: cors.CorsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: true,
        //origin: "*",
        optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
        preflightContinue: false
    }; */

/* mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
 */

ServerStartup(SERVER_RUNNING_MESSAGE);

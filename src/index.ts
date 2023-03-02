// external imports of sources
import * as dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import consola from "consola";
import bodyparser from "body-parser";
import morgan from "morgan";
import createError from "http-errors";
import passport from "passport";
import cors from "cors";
import responseTime from "response-time";
import session from "express-session";
// internal crafted imports of sources
import { SERVER_RUNNING_MESSAGE, REDIS_CLIENT } from "./constants/index";
import * as Auth from "./Authentication/Stud_Admin_Auth/index";
import { tokenAuth } from "./utils/Auth";
import { DB_CONNECTION } from "./utils/index";
import "./utils/Facebook_Auth";
import "./utils/Google_Auth";
import "./utils/Github_Auth";
import {
  SendingMail,
  SendPhoneVerification,
} from "./Authentication/Stud_Admin_Auth/Student";

dotenv.config({ override: true });

const Server: Express = express();

Server.use(
  session({
    secret: "my secret",
    // resave: false, // do not resave session i unmodified
    // saveUninitialized: false, // don't create session until something stored
  })
);
const { PORT, FACEBOOK_ID, FACEBOOK_SECRET } = process.env;
const ServerPort = PORT || 5000;

const {
  StudentRegister,
  AdminRegister,
  StudentLogin,
  tokenVerification,
  studentInfo,
} = Auth;

const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,POST,DELETE",
  origin: true,
  //origin: "*",
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
};
// use for setting CROSS ORIGIN RESSOURCES SHARING between the server and the client
//Server.use(cors(options));
// recording response time for every request in http servers
Server.use(responseTime());
// using body-parser for parsing incoming request bodies to the Express Middlewares
Server.use(bodyparser.urlencoded({ extended: true }));
Server.use(bodyparser.json());
// an express middleware for parsing incoming request loggers for a good visualization
// on api Routes of the Server
Server.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);
// initialize passport
Server.use(passport.initialize());

Server.post("/login/student", StudentLogin);
Server.post("/login/admin");
Server.post("/register/student/:status", StudentRegister);
Server.post("/register/admin/:status");

// FACEBOOK route
Server.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
    session: false, // manage session with REDIS and Localstorage instead
  })
);

// route for returning failure or success message
Server.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/logout",
    failureMessage: true,
  }),
  async function (req: Request, res: Response) {
    try {
      res.redirect("/");
    } catch (error) {
      throw new createError.Unauthorized(`${error}`);
    }
  }
);

Server.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: "reset session" });
});

// GOOGLE route
Server.get("/login/google", passport.authenticate("google"));

// route for returning failure or success callback
Server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/logout",
    failureMessage: true,
  }),
  async function (req: Request, res: Response) {
    try {
      res.redirect("/");
    } catch (error) {
      throw new createError.Unauthorized(`${error}`);
    }
  }
);

// GITHUB AUTH
Server.get("/auth/github", passport.authenticate("github"));

Server.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/logout" }),
  async function (req: Request, res: Response) {
    // Successful authentication, redirect home.
    try {
      res.redirect("/");
    } catch (error) {
      throw new createError.Unauthorized(`${error}`);
    }
  }
);

Server.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send(
    `login <a  href="/auth/facebook">FACEBOOK<a> or <a href="/login/google">GOOGLE<a> or <a href=/auth/github>GITHUB<a>`
  );
});

Server.post("/sendmail", SendingMail);
Server.get("/sendphone", SendPhoneVerification);

const ServerStartup = async (message: string) => {
  try {
    // redisDB connection
    await REDIS_CLIENT.connect();
    // mongoDB connection
    await DB_CONNECTION(true);
    // start the server
    Server.listen(ServerPort, () => {
      consola.info({
        message: `🚀⚡️[server]: ${message} http://localhost:${ServerPort}`,
      });
    });
  } catch (err) {
    throw createError.Conflict(`${err}`);
  } finally {
    consola.info({
      message: "Server is launching",
    });
  }
};

ServerStartup(SERVER_RUNNING_MESSAGE);

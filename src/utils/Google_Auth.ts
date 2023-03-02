import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config({ override: true }); // override any env variable similar  to those of the main module

const { GOOGLE_ID, GOOGLE_SECRET, GOOGLE_CALLBACK_URI } = process.env;

const Server: Express = express();

// configure Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: `${GOOGLE_ID}`, // get ID on Google developper platform
      clientSecret: `${GOOGLE_SECRET}`, // get SECRET on Google developer platform
      callbackURL: `${GOOGLE_CALLBACK_URI}`,
      scope: ["profile"],
      state: true,
    },
    // @ts-ignore
    // this function contains senstive data of the user like name, email, id etc.. from profile passed as a param
    function verify(accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
    }
  )
);

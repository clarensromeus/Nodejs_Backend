import dotenv from "dotenv";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { RegisterModel } from "../models/index";
import { REDIS_CLIENT } from "../constants/index";

dotenv.config({ override: true });

const { FACEBOOK_ID, FACEBOOK_SECRET } = process.env;

REDIS_CLIENT.on("error", (error) => {
  console.log(error);
});

// configure the stratergy for Facebook Auth
passport.use(
  new FacebookStrategy(
    {
      clientID: `${FACEBOOK_ID}`,
      clientSecret: `${FACEBOOK_SECRET}`,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["id", "displayName", "name", "email", "photos"],
    },
    // @ts-ignore
    // this function contains senstive data of the user like name, email, id etc.. from profile passed as a param
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
    }
  )
);

// serialize the user
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// deserialize the user
passport.deserializeUser(function (obj, cb) {
  //@ts-ignore
  cb(null, obj);
});

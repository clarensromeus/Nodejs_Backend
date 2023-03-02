import * as dotenv from "dotenv";
import passportGit from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

dotenv.config();

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URI } =
  process.env;

// configure the strategy for GITHUB
passportGit.use(
  new GitHubStrategy(
    {
      clientID: `${GITHUB_CLIENT_ID}`,
      clientSecret: `${GITHUB_CLIENT_SECRET}`,
      callbackURL: `${GITHUB_CALLBACK_URI}`,
    },

    // this function contains senstive data of the user like name, email, id etc.. from profile passed as a param
    // @ts-ignore
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
    }
  )
);

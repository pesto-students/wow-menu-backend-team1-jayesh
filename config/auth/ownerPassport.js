import passport from "passport";
import LocalStrategy from "passport-local";
import { Users } from "../../src/models";
import bcrypt from "bcrypt";
import generateJWTToken from "../../src/utils/generateJWTTokenUtil";
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from "../index";

const localOpts = {
  usernameField: "emailId",
};

const localStrategy = new LocalStrategy(
  localOpts,
  async (emailId, password, done) => {
    try {
      const user = await Users.find({ emailId });
      if (user.length === 0) {
        return done(null, false, { message: "Email id is not registered" });
      } else if (
        (await bcrypt.compare(password, user[0].password)) &&
        user[0].isVerified
      ) {
        const payload = user[0];
        payload["password"] = undefined;
        const accessToken = generateJWTToken(payload, "access");
        const refreshToken = generateJWTToken(payload, "refresh");
        return done(null, { userDetails: payload, accessToken, refreshToken });
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error);
    }
  },
);

passport.use("owner-local", localStrategy);

export const authLocalOwner = passport.authenticate("owner-local", {
  session: false,
  failWithError: false,
});

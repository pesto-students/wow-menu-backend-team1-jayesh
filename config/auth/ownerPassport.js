import passport from "passport";
import LocalStrategy from "passport-local";
import { Users } from "../../src/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../index";

const localOpts = {
  usernameField: "email_id",
};

const localStrategy = new LocalStrategy(
  localOpts,
  async (email_id, password, done) => {
    try {
      const user = await Users.find({ email_id });

      if (user.length === 0) {
        return done(null, false, { message: "Email id is not registered" });
      } else if (
        (await bcrypt.compare(password, user[0].password)) &&
        user[0].is_verified
      ) {
        let token = jwt.sign(JSON.stringify(user[0]), SECRET_KEY);
        return done(null, token);
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

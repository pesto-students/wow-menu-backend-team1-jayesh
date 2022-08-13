import passport from "passport";
import LocalStrategy from "passport-local";
import { Owners } from "../../src/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const localOpts = {
  usernameField: "email_id",
};

const localStrategy = new LocalStrategy(
  localOpts,
  async (email, password, done) => {
    try {
      const user = await Owners.find({ email_id: email });
      if (user.length === 0) {
        return done(null, false, { message: "Email id is not registered" });
      } else {
        if (await bcrypt.compare(password, user[0].password)) {
          let token = jwt.sign(JSON.stringify(user[0]), "secret-key");
          return done(null, token);
        } else {
          return done(null, false);
        }
      }
    } catch (error) {
      return done(error);
    }
  },
);

passport.use(localStrategy);

export const authLocal = passport.authenticate("local", {
  session: false,
  failWithError: false,
});

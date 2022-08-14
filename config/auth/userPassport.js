import passport from "passport";
import LocalStrategy from "passport-local";
import { Users } from "../../src/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../index";

const localStrategy = new LocalStrategy(
  {},
  async (username, password, done) => {
    try {
      const user = await Users.find({ username });
      if (user.length === 0) {
        return done(null, false, { message: "Username is not registered" });
      } else {
        if (await bcrypt.compare(password, user[0].password)) {
          let token = jwt.sign(JSON.stringify(user[0]), SECRET_KEY);
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

export const authLocalUser = passport.authenticate("local", {
  session: false,
  failWithError: false,
});

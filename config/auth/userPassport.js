import passport from "passport";
import LocalStrategy from "passport-local";
import { Users } from "../../src/models";
import bcrypt from "bcrypt";
import generateJWTToken from "../../src/utils/generateJWTTokenUtil";

const localStrategy = new LocalStrategy(
  {},
  async (username, password, done) => {
    try {
      const user = await Users.find({ username }).populate("restaurant");
      if (user.length === 0) {
        return done(null, false, { message: "Username is not registered" });
      } else {
        if (await bcrypt.compare(password, user[0].password)) {
          const payload = user[0];
          payload["password"] = undefined;
          const accessToken = generateJWTToken(payload, "access");
          const refreshToken = generateJWTToken(payload, "refresh");
          return done(null, {
            userDetails: payload,
            accessToken,
            refreshToken,
          });
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

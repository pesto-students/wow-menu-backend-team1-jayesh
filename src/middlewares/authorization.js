import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Users } from "../models";
import passport from "passport";
import { SECRET_KEY } from "../../config";

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await Users.findById(payload.id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(jwtStrategy);

export const authJwt = passport.authenticate("jwt", { session: false });

import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Users } from "../../models";
import passport from "passport";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config";

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET_KEY,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (userDetails, done) => {
  try {
    const { payload } = userDetails;
    const user = await Users.findById(payload.id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use("access-token-rules", jwtStrategy);

export const authAccessToken = passport.authenticate("access-token-rules", {
  session: false,
});

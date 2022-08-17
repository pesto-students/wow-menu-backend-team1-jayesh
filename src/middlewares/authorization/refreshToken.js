import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Users } from "../../models";
import passport from "passport";
import { REFRESH_TOKEN_SECRET_KEY } from "../../../config";

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: REFRESH_TOKEN_SECRET_KEY,
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

passport.use("refresh-token-rules", jwtStrategy);

export const authRefreshToken = passport.authenticate("refresh-token-rules", {
  session: false,
});

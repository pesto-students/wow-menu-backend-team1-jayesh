import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Users } from "../../models";
import passport from "passport";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config";
import isTokenBlackListedUtil from "../../utils/isTokenBlackListedUtil";

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

export const authAccessToken = async function (req, res, next) {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (await isTokenBlackListedUtil(accessToken)) {
      res.status(401).json({ message: "Expired/invalid token passed" });
    } else {
      await passport.authenticate("access-token-rules", {
        session: false,
      })(req, res, next);
    }
  } else {
    res
      .status(400)
      .json({ message: "Send valid authorization header to access the api" });
  }
};

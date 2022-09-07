import { Users } from "../../models";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config";
import isTokenBlackListedUtil from "../../utils/isTokenBlackListedUtil";
import jwt from "jsonwebtoken";

// const jwtOpts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: ACCESS_TOKEN_SECRET_KEY,
// };

// const jwtStrategy = new JWTStrategy(jwtOpts, async (userDetails, done) => {
//   try {
//     const { payload } = userDetails;
//     const user = await Users.findById(payload.id);
//
//     if (!user) {
//       return done(null, false);
//     }
//     return done(null, user);
//   } catch (e) {
//     return done(e, false);
//   }
// });

// passport.use("access-token-rules", jwtStrategy);

export const authAccessToken = async function (req, res, next) {
  if (req.cookies.accessToken) {
    const accessToken = req.cookies.accessToken.split(" ")[1];
    if (await isTokenBlackListedUtil(accessToken)) {
      res.status(401).json({ message: "Expired/invalid token passed" });
    } else {
      await jwt.verify(
        accessToken,
        ACCESS_TOKEN_SECRET_KEY,
        async (err, userDetails) => {
          try {
            if (err) res.status(400).json("Invalid token");
            const { payload } = userDetails;
            const user = await Users.findById(payload.id).populate(
              "restaurant",
            );

            if (!user) {
              res.status(400).json("Invalid user details");
            }

            req.user = user;
            next();
          } catch (e) {
            res.status(400).json("Try after sometime");
          }
        },
      );
    }
  } else {
    res
      .status(400)
      .json({ message: "Send valid authorization header to access the api" });
  }
};

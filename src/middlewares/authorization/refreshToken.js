import { Users } from "../../models";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../../../config";
import isTokenBlackListedUtil from "../../utils/isTokenBlackListedUtil";
import jwt from "jsonwebtoken";

export const authRefreshToken = async function (req, res, next) {
  if (req.cookies) {
    const refreshToken = req.cookies.refreshToken.split(" ")[1];
    if (await isTokenBlackListedUtil(refreshToken)) {
      res.status(401).json({ message: "Expired/invalid token passed" });
    } else {
      await jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET_KEY,
        async (err, userDetails) => {
          try {
            if (err) res.status(400).json("Invalid token");
            const { payload } = userDetails;
            const user = await Users.findById(payload.id);

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

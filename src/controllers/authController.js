import { BlackListedTokens, Users } from "../models";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET_KEY } from "../../config";
import generateJWTToken from "../utils/generateJWTTokenUtil";
import moment from "moment";
import isTokenBlackListedUtil from "../utils/isTokenBlackListedUtil";

const authController = {
  async verifyEmail(req, res) {
    try {
      const data = await Users.findById(req.query.id);
      if (req.query.hashedString === data.password) {
        await Users.findByIdAndUpdate(
          req.query.id,
          { isVerified: true },
          { new: true },
        );
        res.status(200).json({
          message: "Email is successfully verified",
        });
      } else {
        res.status(422).json({ message: "Clicked on invalid link" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unable to verify email. Please try again later.",
      });
    }
  },

  async authenticate(req, res) {
    res.json({ data: req.user });
  },

  async refreshAccessToken(req, res) {
    const refreshToken = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
    const accessToken = generateJWTToken(data.payload, "access");
    res.json({
      data: {
        userDetails: data.payload,
        accessToken,
        refreshToken,
      },
    });
  },

  async logout(req, res, next) {
    const accessToken = req.headers.authorization.split(" ")[1];
    const refreshToken = req.body.refreshToken;
    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET_KEY,
      async (err, userDetails) => {
        if (err) {
          res.status(401).json({ message: "Invalid access token" });
        } else if (await isTokenBlackListedUtil(refreshToken)) {
          res.status(401).json({ message: "Invalid refresh token" });
        } else {
          const currentTs = new Date();
          const { payload } = userDetails;
          const data = [
            {
              token: refreshToken,
              userId: payload.id,
              expiresAt: moment(currentTs).add("1", "day"),
            },
            {
              token: accessToken,
              userId: payload.id,
              expiresAt: moment(currentTs).add("30", "minutes"),
            },
          ];
          try {
            for (const user of data) {
              await new BlackListedTokens(user).save();
            }
            res.status(200).json({ message: "Logout successfully" });
          } catch (error) {
            next(error);
          }
        }
      },
    );
  },
};

export default authController;

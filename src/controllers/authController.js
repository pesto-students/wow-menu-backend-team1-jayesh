import { BlackListedTokens, Users } from "../models";
import jwt from "jsonwebtoken";
import { CLIENT_APP_URL, REFRESH_TOKEN_SECRET_KEY } from "../../config";
import generateJWTToken from "../utils/generateJWTTokenUtil";
import moment from "moment";
import isTokenBlackListedUtil from "../utils/isTokenBlackListedUtil";
import { isCached, storeDataInCache } from "../utils/cacheUtil";
import * as Sentry from "@sentry/node";

const authController = {
  async verifyEmail(req, res) {
    try {
      if (await isCached("verified-mail", req.query.id)) {
        res.status(410).json({
          message: "User is already verified and the link is expired",
        });
      } else {
        const data = await Users.findById(req.query.id);
        if (req.query.hashedString === data.password) {
          await Users.findByIdAndUpdate(
            req.query.id,
            { isVerified: true },
            { new: true },
          );
          await storeDataInCache(
            "verified-mail",
            req.query.id,
            req.query.emailId,
            true,
          );
          res.status(302).redirect(CLIENT_APP_URL + "?success=true");
        } else {
          res.status(422).redirect(CLIENT_APP_URL + "?success=false");
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({
        message: "Unable to verify email. Please try again later.",
      });
    }
  },

  async authenticate(req, res) {
    const { accessToken, refreshToken } = req.user;
    delete req.user.accessToken;
    delete req.user.refreshToken;
    res
      .cookie("accessToken", `Bearer ${accessToken}`, {
        httponly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 30,
        // expires: 1000 * 60 * 30,
      })
      .cookie("refreshToken", `Bearer ${refreshToken}`, {
        httponly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .header("Access-Control-Allow-Credentials", true)
      .header("Origin-Allow-Credentials", true)
      .json({ data: req.user });
  },

  async refreshAccessToken(req, res) {
    const refreshToken = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
    const accessToken = generateJWTToken(data.payload, "access");
    res
      .cookie("accessToken", `Bearer ${accessToken}`, {
        httponly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 30,
        // expires: 1000 * 60 * 30,
      })
      .cookie("refreshToken", `Bearer ${refreshToken}`, {
        httponly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .header("Access-Control-Allow-Credentials", true)
      .header("Origin-Allow-Credentials", true)
      .json({
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
            res
              .status(200)
              .cookie("accessToken", ``, {
                httponly: true,
                sameSite: "none",
                secure: true,
              })
              .cookie("refreshToken", ``, {
                httponly: true,
                sameSite: "none",
                secure: true,
              })
              .json({ message: "Logout successfully" });
          } catch (error) {
            next(error);
          }
        }
      },
    );
  },
};

export default authController;

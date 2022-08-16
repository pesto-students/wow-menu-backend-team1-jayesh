import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";

export default function generateJWTToken(payload) {
  return jwt.sign(JSON.stringify(payload), SECRET_KEY);
}

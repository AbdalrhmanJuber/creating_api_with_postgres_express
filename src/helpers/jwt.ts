import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (user: {
  id: number;
  firstName: string;
  lastName: string;
}) => {
  const payload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "1h") as `${number}${"d" | "h" | "m" | "s"}`;

  const options: SignOptions = { expiresIn };

  const token = jwt.sign(payload, JWT_SECRET, options);

  return token;
};

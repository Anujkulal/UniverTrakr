import jwt from "jsonwebtoken";

const createToken = (res, _id) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  // set JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default createToken;

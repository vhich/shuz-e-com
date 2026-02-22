import jwt from "jsonwebtoken";

export const generateToken = (id, res, tokenName) => {
  const durationInDays = 2;
  // Convert days to milliseconds for cookie maxAge
  const maxAge = durationInDays * 24 * 60 * 60 * 1000;

  // 1. Create the JWT
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${durationInDays}d`,
  });

  // 2. Set the Cookie
  res.cookie(tokenName, token, {
    httpOnly: true,
    // On Render, it's safer to just set these to true/none for the live build
    secure: true,
    sameSite: "None",
    maxAge: maxAge,
    path: "/",
  });

  return token;
};

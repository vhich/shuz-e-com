import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
  const durationInDays = 2;
  // Convert days to milliseconds for cookie maxAge
  const maxAge = durationInDays * 24 * 60 * 60 * 1000;

  // 1. Create the JWT
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${durationInDays}d`,
  });

  // 2. Set the Cookie
  res.cookie("ShuzAdminToken", token, {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "Lax" is usually better than "Strict" for local dev
    maxAge: maxAge,
    path: "/",
  });

  return token; // Optional: return it in case you want to use it elsewhere
};

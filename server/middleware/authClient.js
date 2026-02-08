import jwt from "jsonwebtoken";

const authClient = async (req, res, next) => {
  const token = req.cookies.ShuzClientToken;

  try {
    if (!token)
      return res.json({
        success: false,
        message: "Unauthorized, no token found!",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.clientId = decoded.id;

    next();
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

export default authClient;

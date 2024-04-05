import jwt from "jsonwebtoken";
export default async (req, res, next) => {
  //check jwt inside header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.json({ status: 400, message: "No Token Found" });
  }

  try {
    let user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = user.email;
    next();
  } catch (error) {
    return res.json({ status: 400, message: "Invalid token" });
  }
};

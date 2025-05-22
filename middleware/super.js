import jwt from "jsonwebtoken";

const superAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "superadmin")
      return res
        .status(401)
        .json({ message: "You are not authorized", status: "unauthorized" });
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "Token expired" });
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default superAuth;

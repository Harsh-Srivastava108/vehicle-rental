import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]; // safer way
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Ensure format is "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info for routes

    next();
  } catch (err) {
    console.error("❌ JWT Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;

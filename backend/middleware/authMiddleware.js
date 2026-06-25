const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = { authMiddleware };

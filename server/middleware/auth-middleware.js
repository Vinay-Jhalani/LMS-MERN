const jwt = require("jsonwebtoken");

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(400).json({
      status: false,
      message: "User is not authenticated",
    });
  else {
    const token = authHeader.split(" ")[1];

    try {
      const payload = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Token has expired");
        return res.status(401).json({
          status: false,
          message: "Session Expired",
        });
        // Respond appropriately, e.g., send a 401 response to the client
      } else {
        console.log("Token error:", err);
        return res.status(401).json({
          status: false,
          message: "Please login again , error in verifying your details",
        });
      }
    }
  }
};

module.exports = authenticate;

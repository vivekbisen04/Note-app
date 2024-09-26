const jwt =require("jsonwebtoken")


const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "THIS_IS_JWT_SECRET_KEY";
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    // Save user ID in request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports={
  authenticateToken,
}
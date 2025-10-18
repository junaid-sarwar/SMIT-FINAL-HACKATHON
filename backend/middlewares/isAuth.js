import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please log in again.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Attach user id to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default isAuth;

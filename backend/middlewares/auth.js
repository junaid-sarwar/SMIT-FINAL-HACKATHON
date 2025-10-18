import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to access this resource",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}

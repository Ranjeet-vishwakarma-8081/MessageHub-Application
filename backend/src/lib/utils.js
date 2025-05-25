import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  // Generate JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in Millisecond
    httpOnly: true, // Prevents XSS attacks- Cross-Site Scripting attacks
    sameSite: "strict", // Prevents CSRF attacks- Cross-Site Request Forgery attacks
    secure: process.env.NODE_ENV !== "development", //Whether it should only be sent over HTTPS or HTTP
  });
  return token;
};

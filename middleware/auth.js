import jwt from "jsonwebtoken";

const protectMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
  req.user = null; // allow guest
  return next();
}

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // decoded must contain { id, role }
    req.user = decoded;
    console.log(req.user)
  } catch (error) {
    req.user = null;
  }
  next();
};

export default protectMiddleware;
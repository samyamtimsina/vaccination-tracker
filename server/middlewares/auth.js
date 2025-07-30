import jwt from 'jsonwebtoken';

//Middleware: check JWT
export const authenticate = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader?.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; //Attach decoded user to req
    next();
  } catch (error) {
    console.error(error);
    res
      .status(403)
      .json({ error: 'Invalid or expired token', reason: error.message });
  }
};

//Middleware: check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acess denied' });
    }
    next();
  };
};

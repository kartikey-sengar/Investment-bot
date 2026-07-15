import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'finpilot_super_secret_dev_key_2026';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (_error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

export const generateToken = (user, remember = false) => {
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  };


  const expiresIn = remember ? '2m' : '1m';

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token de autorización' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }

  req.user = decoded;
  next();
};
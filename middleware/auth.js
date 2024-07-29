// middlewares/auth.js
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.js'; // Assuming you have an admin model

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const admin = await Admin.findOne({ _id: decoded._id });

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Please authenticate as admin.' });
  }
};

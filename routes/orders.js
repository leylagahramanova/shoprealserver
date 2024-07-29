import { Router } from 'express';
import { Orders } from '../models/ordersModel.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Create a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userID, orderProducts, totalMoney } = req.body;

    const newOrder = new Orders({
      userID,
      orderProducts,
      totalMoney,
    });

    await newOrder.save();
    res.status(201).json({ orderStatus: 'success' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Orders.find({}).populate('userID').exec();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;

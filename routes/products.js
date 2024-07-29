// server/routes/products.js
import { Router } from 'express';
import { Products } from '../models/product.js'; // Adjust the import to your project structure
import { authMiddleware } from '../middlewares/auth.js'; // Adjust the import to your project structure
import bcrypt from 'bcrypt';

const router = Router();

// Get all available products
router.get('/', async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get a product by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Search product by title
router.get('/search/:title', async (req, res) => {
  const reg_pattern = `.*${req.params.title}.*`;
  try {
    const products = await Products.find({
      title: new RegExp(reg_pattern, "i"),
    });
    res.json(products);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Add a product to the database
router.post("/", authMiddleware, async (req, res) => {
  const new_product = new Products({
    title: req.body.title,
    price: parseFloat(req.body.price),
    image_src: req.body.image_src,
    category: req.body.category,
    type: req.body.type,
  });
  try {
    await new_product.save();
    res.status(201).send({ message: "Product created successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Find a product by ID and modify its information
router.put("/:id", authMiddleware, async (req, res) => {
  const updated_product = {
    title: req.body.title,
    price: parseFloat(req.body.price),
    image_src: req.body.image_src,
    category: req.body.category,
    type: req.body.type,
  };
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, updated_product, { new: true });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Find a product by ID and delete it from the database
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Products.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;

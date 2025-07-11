import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, patchProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.patch('/:id', verifyToken, patchProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router; 
import { Router } from 'express';
import { getProductsController, getProductByIdController, createProductController, updateProductController, deleteProductController, patchProductController } from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getProductsController);
router.get('/:id', getProductByIdController);
router.post('/', verifyToken, createProductController);
router.put('/:id', verifyToken, updateProductController);
router.patch('/:id', verifyToken, patchProductController);
router.delete('/:id', verifyToken, deleteProductController);

export default router; 
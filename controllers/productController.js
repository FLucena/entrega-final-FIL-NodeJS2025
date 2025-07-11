import { db } from '../config/firebase.js';
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

async function loadMockData() {
  try {
    const mockDataPath = join(__dirname, '..', 'data', 'mockProducts.json');
    const mockData = await readFile(mockDataPath, 'utf-8');
    const parsedData = JSON.parse(mockData);
    return parsedData.products || [];
  } catch (error) {
    return [];
  }
}

export const getProducts = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      return res.json(mockProducts);
    }

    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      return res.status(200).json({
        message: 'No hay productos disponibles',
        products: []
      });
    }

    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      message: 'Productos obtenidos correctamente',
      products
    });
  } catch (error) {
    try {
      const mockProducts = await loadMockData();
      return res.json({
        message: 'Usando datos de respaldo',
        products: mockProducts
      });
    } catch (mockError) {
      res.status(500).json({ 
        error: 'Error al obtener los productos',
        message: 'No se pudieron obtener los productos ni cargar los datos de respaldo'
      });
    }
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        return res.status(404).json({ 
          error: 'Producto no encontrado',
          message: `No existe un producto con el ID: ${id}`
        });
      }
      return res.json({
        message: 'Producto obtenido correctamente',
        product
      });
    }

    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    res.json({
      message: 'Producto obtenido correctamente',
      product: {
        id: productDoc.id,
        ...productDoc.data()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener el producto',
      message: 'Ocurrió un error al intentar obtener el producto'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'Todos los campos (name, description, price, stock) son requeridos'
      });
    }

    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const newProduct = {
        id: (mockProducts.length + 1).toString(),
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        createdAt: new Date().toISOString()
      };
      return res.status(201).json({
        message: 'Producto creado correctamente',
        product: newProduct
      });
    }

    const productRef = await db.collection('products').add({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Producto creado correctamente',
      product: {
        id: productRef.id,
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        createdAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear el producto',
      message: 'Ocurrió un error al intentar crear el producto'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'Todos los campos (name, description, price, stock) son requeridos'
      });
    }

    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const productIndex = mockProducts.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ 
          error: 'Producto no encontrado',
          message: `No existe un producto con el ID: ${id}`
        });
      }

      const updatedProduct = {
        ...mockProducts[productIndex],
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        updatedAt: new Date().toISOString()
      };

      return res.status(200).json({
        message: 'Producto actualizado correctamente',
        product: updatedProduct
      });
    }

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    await productRef.update({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      updatedAt: new Date()
    });

    const updatedDoc = await productRef.get();
    res.status(200).json({
      message: 'Producto actualizado correctamente',
      product: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar el producto',
      message: 'Ocurrió un error al intentar actualizar el producto'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const productIndex = mockProducts.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ 
          error: 'Producto no encontrado',
          message: `No existe un producto con el ID: ${id}`
        });
      }

      return res.status(200).json({
        message: 'Producto eliminado correctamente'
      });
    }

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    await productRef.delete();

    res.status(200).json({
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar el producto',
      message: 'Ocurrió un error al intentar eliminar el producto'
    });
  }
};

export const patchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar que al menos un campo sea proporcionado
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'Datos de actualización requeridos',
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    // Validar campos permitidos
    const allowedFields = ['name', 'description', 'price', 'stock'];
    const invalidFields = Object.keys(updateData).filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        error: 'Campos no permitidos',
        message: `Los siguientes campos no están permitidos: ${invalidFields.join(', ')}`
      });
    }

    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const productIndex = mockProducts.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ 
          error: 'Producto no encontrado',
          message: `No existe un producto con el ID: ${id}`
        });
      }

      // Actualizar solo los campos proporcionados
      const updatedProduct = {
        ...mockProducts[productIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Convertir price y stock a números si están presentes
      if (updateData.price !== undefined) {
        updatedProduct.price = Number(updateData.price);
      }
      if (updateData.stock !== undefined) {
        updatedProduct.stock = Number(updateData.stock);
      }

      return res.status(200).json({
        message: 'Producto actualizado parcialmente correctamente',
        product: updatedProduct
      });
    }

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    // Preparar datos de actualización
    const updateFields = { ...updateData, updatedAt: new Date() };
    
    // Convertir price y stock a números si están presentes
    if (updateFields.price !== undefined) {
      updateFields.price = Number(updateFields.price);
    }
    if (updateFields.stock !== undefined) {
      updateFields.stock = Number(updateFields.stock);
    }

    await productRef.update(updateFields);

    const updatedDoc = await productRef.get();
    res.status(200).json({
      message: 'Producto actualizado parcialmente correctamente',
      product: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar el producto',
      message: 'Ocurrió un error al intentar actualizar el producto'
    });
  }
}; 
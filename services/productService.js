// --- Servicio de productos ---
import { db } from '../config/firebase.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { isValidProductFields, isValidPatchFields, toNumberIfPresent } from '../utils/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadMockProducts() {
  try {
    const mockDataPath = join(__dirname, '..', 'data', 'mockProducts.json');
    const mockData = await readFile(mockDataPath, 'utf-8');
    const parsedData = JSON.parse(mockData);
    return parsedData.products || [];
  } catch (error) {
    return [];
  }
}

export async function getAllProducts() {
  if (process.env.NODE_ENV === 'development') {
    return await loadMockProducts();
  }
  try {
    const productsSnapshot = await db.collection('products').get();
    if (productsSnapshot.empty) {
      return [];
    }
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // Fallback a mock
    return await loadMockProducts();
  }
}

export async function getProductById(id) {
  if (process.env.NODE_ENV === 'development') {
    const mockProducts = await loadMockProducts();
    return mockProducts.find(p => p.id === id) || null;
  }
  try {
    const productDoc = await db.collection('products').doc(id).get();
    if (!productDoc.exists) return null;
    return { id: productDoc.id, ...productDoc.data() };
  } catch (error) {
    // Fallback a mock
    const mockProducts = await loadMockProducts();
    return mockProducts.find(p => p.id === id) || null;
  }
}

export async function createProduct(data) {
  if (!isValidProductFields(data)) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Todos los campos (name, description, price, stock) son requeridos' };
  }
  if (process.env.NODE_ENV === 'development') {
    const mockProducts = await loadMockProducts();
    const newProduct = {
      id: (mockProducts.length + 1).toString(),
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      createdAt: new Date().toISOString()
    };
    return { product: newProduct, message: 'Producto creado correctamente' };
  }
  const productRef = await db.collection('products').add({
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
    createdAt: new Date()
  });
  return { product: { id: productRef.id, ...data, price: Number(data.price), stock: Number(data.stock), createdAt: new Date() }, message: 'Producto creado correctamente' };
}

export async function updateProduct(id, data) {
  if (!isValidProductFields(data)) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Todos los campos (name, description, price, stock) son requeridos' };
  }
  if (process.env.NODE_ENV === 'development') {
    const mockProducts = await loadMockProducts();
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
    }
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      updatedAt: new Date().toISOString()
    };
    return { product: updatedProduct, message: 'Producto actualizado correctamente' };
  }
  const productRef = db.collection('products').doc(id);
  const productDoc = await productRef.get();
  if (!productDoc.exists) {
    throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
  }
  await productRef.update({
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
    updatedAt: new Date()
  });
  const updatedDoc = await productRef.get();
  return { product: { id: updatedDoc.id, ...updatedDoc.data() }, message: 'Producto actualizado correctamente' };
}

export async function deleteProduct(id) {
  if (process.env.NODE_ENV === 'development') {
    const mockProducts = await loadMockProducts();
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
    }
    return { message: 'Producto eliminado correctamente' };
  }
  const productRef = db.collection('products').doc(id);
  const productDoc = await productRef.get();
  if (!productDoc.exists) {
    throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
  }
  await productRef.delete();
  return { message: 'Producto eliminado correctamente' };
}

export async function patchProduct(id, updateData) {
  if (!isValidPatchFields(updateData)) {
    throw { status: 400, error: 'Datos de actualización requeridos o campos no permitidos', message: 'Debe proporcionar al menos un campo permitido para actualizar (name, description, price, stock)' };
  }
  if (process.env.NODE_ENV === 'development') {
    const mockProducts = await loadMockProducts();
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
    }
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...toNumberIfPresent(updateData, ['price', 'stock']),
      updatedAt: new Date().toISOString()
    };
    return { product: updatedProduct, message: 'Producto actualizado parcialmente correctamente' };
  }
  const productRef = db.collection('products').doc(id);
  const productDoc = await productRef.get();
  if (!productDoc.exists) {
    throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
  }
  const updateFields = { ...toNumberIfPresent(updateData, ['price', 'stock']), updatedAt: new Date() };
  await productRef.update(updateFields);
  const updatedDoc = await productRef.get();
  return { product: { id: updatedDoc.id, ...updatedDoc.data() }, message: 'Producto actualizado parcialmente correctamente' };
} 
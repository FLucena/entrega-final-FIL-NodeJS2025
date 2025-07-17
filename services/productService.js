// --- Servicio de productos ---
// Contiene la lógica de negocio y usa el modelo para acceder a los datos

import * as ProductModel from '../models/productModel.js';
import { isValidProductFields, isValidPatchFields, toNumberIfPresent } from '../utils/validation.js';

export async function getAllProducts() {
  try {
    return await ProductModel.getAll();
  } catch (error) {
    console.error('Error en servicio al obtener productos:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudieron obtener los productos' };
  }
}

export async function getProductById(id) {
  try {
    const product = await ProductModel.getById(id);
    if (!product) {
      throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
    }
    return product;
  } catch (error) {
    if (error.status) throw error; // Re-lanzar errores de negocio
    console.error('Error en servicio al obtener producto:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudo obtener el producto' };
  }
}

export async function createProduct(data) {
  // Validación de campos requeridos
  if (!isValidProductFields(data)) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Todos los campos (name, description, price, stock) son requeridos' };
  }

  try {
    const productData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock)
    };

    const newProduct = await ProductModel.create(productData);
    return { product: newProduct, message: 'Producto creado correctamente' };
  } catch (error) {
    if (error.status) throw error; // Re-lanzar errores de negocio
    console.error('Error en servicio al crear producto:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudo crear el producto' };
  }
}

export async function updateProduct(id, data) {
  // Validación de campos requeridos
  if (!isValidProductFields(data)) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Todos los campos (name, description, price, stock) son requeridos' };
  }

  try {
    const productData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock)
    };

    const updatedProduct = await ProductModel.update(id, productData);
    if (!updatedProduct) {
      throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
    }

    return { product: updatedProduct, message: 'Producto actualizado correctamente' };
  } catch (error) {
    if (error.status) throw error; // Re-lanzar errores de negocio
    console.error('Error en servicio al actualizar producto:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudo actualizar el producto' };
  }
}

export async function deleteProduct(id) {
  try {
    const deleted = await ProductModel.remove(id);
    if (!deleted) {
      throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
    }
    return { message: 'Producto eliminado correctamente' };
  } catch (error) {
    if (error.status) throw error; // Re-lanzar errores de negocio
    console.error('Error en servicio al eliminar producto:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudo eliminar el producto' };
  }
}

export async function patchProduct(id, updateData) {
  // Validación de campos permitidos para PATCH
  if (!isValidPatchFields(updateData)) {
    throw { status: 400, error: 'Datos de actualización requeridos o campos no permitidos', message: 'Debe proporcionar al menos un campo permitido para actualizar (name, description, price, stock)' };
  }

  try {
    const patchData = toNumberIfPresent(updateData, ['price', 'stock']);
    const updatedProduct = await ProductModel.update(id, patchData);
    
    if (!updatedProduct) {
      throw { status: 404, error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` };
    }

    return { product: updatedProduct, message: 'Producto actualizado parcialmente correctamente' };
  } catch (error) {
    if (error.status) throw error; // Re-lanzar errores de negocio
    console.error('Error en servicio al actualizar parcialmente producto:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudo actualizar el producto' };
  }
} 
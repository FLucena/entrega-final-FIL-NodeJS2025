// --- Modelo de Producto ---
// Maneja toda la interacción con la base de datos (Firestore y archivos JSON)

import fs from 'fs';
import path from 'path';
import { db } from '../config/firebase.js';

const dataPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/mockProducts.json');

// --- Funciones para archivos JSON ---

function readProductsFromFile() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  const parsed = JSON.parse(data);
  return parsed.products || [];
}

function writeProductsToFile(products) {
  const data = { products };
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// --- Funciones para Firestore ---

async function getAllFromFirestore() {
  try {
    const productsSnapshot = await db.collection('products').get();
    if (productsSnapshot.empty) {
      return [];
    }
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener productos de Firestore:', error);
    throw error;
  }
}

async function getByIdFromFirestore(id) {
  try {
    const productDoc = await db.collection('products').doc(id).get();
    if (!productDoc.exists) return null;
    return { id: productDoc.id, ...productDoc.data() };
  } catch (error) {
    console.error('Error al obtener producto de Firestore:', error);
    throw error;
  }
}

async function createInFirestore(product) {
  try {
    const productRef = await db.collection('products').add(product);
    return { id: productRef.id, ...product };
  } catch (error) {
    console.error('Error al crear producto en Firestore:', error);
    throw error;
  }
}

async function updateInFirestore(id, updatedProduct) {
  try {
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    if (!productDoc.exists) return null;
    
    await productRef.update(updatedProduct);
    const updatedDoc = await productRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error('Error al actualizar producto en Firestore:', error);
    throw error;
  }
}

async function deleteFromFirestore(id) {
  try {
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    if (!productDoc.exists) return false;
    
    await productRef.delete();
    return true;
  } catch (error) {
    console.error('Error al eliminar producto de Firestore:', error);
    throw error;
  }
}

// --- API pública del modelo ---

// Devuelve todos los productos
export async function getAll() {
  if (process.env.NODE_ENV === 'development') {
    return readProductsFromFile();
  }
  
  try {
    return await getAllFromFirestore();
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    return readProductsFromFile();
  }
}

// Devuelve un producto por ID
export async function getById(id) {
  if (process.env.NODE_ENV === 'development') {
    return readProductsFromFile().find(p => p.id === id);
  }
  
  try {
    return await getByIdFromFirestore(id);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    return readProductsFromFile().find(p => p.id === id);
  }
}

// Crea un nuevo producto
export async function create(product) {
  if (process.env.NODE_ENV === 'development') {
    const products = readProductsFromFile();
    const newProduct = {
      ...product,
      id: (products.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    writeProductsToFile(products);
    return newProduct;
  }
  
  try {
    const productWithTimestamp = {
      ...product,
      createdAt: new Date()
    };
    return await createInFirestore(productWithTimestamp);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    const products = readProductsFromFile();
    const newProduct = {
      ...product,
      id: (products.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    writeProductsToFile(products);
    return newProduct;
  }
}

// Actualiza un producto existente por ID
export async function update(id, updatedProduct) {
  if (process.env.NODE_ENV === 'development') {
    const products = readProductsFromFile();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    
    const updated = {
      ...products[idx],
      ...updatedProduct,
      updatedAt: new Date().toISOString()
    };
    products[idx] = updated;
    writeProductsToFile(products);
    return updated;
  }
  
  try {
    const productWithTimestamp = {
      ...updatedProduct,
      updatedAt: new Date()
    };
    return await updateInFirestore(id, productWithTimestamp);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    const products = readProductsFromFile();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    
    const updated = {
      ...products[idx],
      ...updatedProduct,
      updatedAt: new Date().toISOString()
    };
    products[idx] = updated;
    writeProductsToFile(products);
    return updated;
  }
}

// Elimina un producto por ID
export async function remove(id) {
  if (process.env.NODE_ENV === 'development') {
    let products = readProductsFromFile();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    writeProductsToFile(products);
    return products.length < initialLength;
  }
  
  try {
    return await deleteFromFirestore(id);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    let products = readProductsFromFile();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    writeProductsToFile(products);
    return products.length < initialLength;
  }
} 
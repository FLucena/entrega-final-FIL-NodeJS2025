// --- Servicio Firestore para productos ---
// Todas las funciones interactúan con la colección 'products' en Firestore.

import admin from 'firebase-admin';
const db = admin.firestore();

const productsCollection = db.collection('products');

// Obtiene todos los productos de Firestore
export async function getAllProducts() {
  const snapshot = await productsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtiene un producto por ID
export async function getProductById(id) {
  const doc = await productsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// Crea un nuevo producto en Firestore
export async function createProduct(product) {
  const docRef = await productsCollection.add(product);
  return { id: docRef.id, ...product };
}

// Actualiza un producto existente por ID
export async function updateProduct(id, updatedProduct) {
  await productsCollection.doc(id).update(updatedProduct);
  return { id, ...updatedProduct };
}

// Elimina un producto por ID
export async function deleteProduct(id) {
  await productsCollection.doc(id).delete();
  return true;
} 
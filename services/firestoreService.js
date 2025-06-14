const admin = require('firebase-admin');
const db = admin.firestore();

const productsCollection = db.collection('products');

async function getAllProducts() {
  const snapshot = await productsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getProductById(id) {
  const doc = await productsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function createProduct(product) {
  const docRef = await productsCollection.add(product);
  return { id: docRef.id, ...product };
}

async function updateProduct(id, updatedProduct) {
  await productsCollection.doc(id).update(updatedProduct);
  return { id, ...updatedProduct };
}

async function deleteProduct(id) {
  await productsCollection.doc(id).delete();
  return true;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 
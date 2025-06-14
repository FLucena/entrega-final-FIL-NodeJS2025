import admin from 'firebase-admin';
const db = admin.firestore();

const productsCollection = db.collection('products');

export async function getAllProducts() {
  const snapshot = await productsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProductById(id) {
  const doc = await productsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createProduct(product) {
  const docRef = await productsCollection.add(product);
  return { id: docRef.id, ...product };
}

export async function updateProduct(id, updatedProduct) {
  await productsCollection.doc(id).update(updatedProduct);
  return { id, ...updatedProduct };
}

export async function deleteProduct(id) {
  await productsCollection.doc(id).delete();
  return true;
} 
// --- Modelo de Producto basado en archivo JSON local ---
// Proporciona funciones CRUD para productos usando mockProducts.json

import fs from 'fs';
import path from 'path';

const dataPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/mockProducts.json');

// Lee todos los productos del archivo
function readProducts() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  const parsed = JSON.parse(data);
  return parsed.products || [];
}

// Escribe la lista de productos en el archivo
function writeProducts(products) {
  const data = { products };
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Devuelve todos los productos
export function getAll() {
  return readProducts();
}

// Devuelve un producto por ID
export function getById(id) {
  return readProducts().find(p => p.id === id);
}

// Crea un nuevo producto y lo guarda
export function create(product) {
  const products = readProducts();
  products.push(product);
  writeProducts(products);
  return product;
}

// Actualiza un producto existente por ID
export function update(id, updatedProduct) {
  const products = readProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updatedProduct };
  writeProducts(products);
  return products[idx];
}

// Elimina un producto por ID
export function remove(id) {
  let products = readProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  writeProducts(products);
  return products.length < initialLength;
} 
import fs from 'fs';
import path from 'path';

const dataPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/products.json');

function readProducts() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

export function getAll() {
  return readProducts();
}

export function getById(id) {
  return readProducts().find(p => p.id === id);
}

export function create(product) {
  const products = readProducts();
  products.push(product);
  writeProducts(products);
  return product;
}

export function update(id, updatedProduct) {
  const products = readProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updatedProduct };
  writeProducts(products);
  return products[idx];
}

export function remove(id) {
  let products = readProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  writeProducts(products);
  return products.length < initialLength;
} 
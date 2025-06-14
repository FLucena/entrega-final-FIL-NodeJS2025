const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

function readProducts() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

module.exports = {
  getAll: () => readProducts(),
  getById: (id) => readProducts().find(p => p.id === id),
  create: (product) => {
    const products = readProducts();
    products.push(product);
    writeProducts(products);
    return product;
  },
  update: (id, updatedProduct) => {
    const products = readProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updatedProduct };
    writeProducts(products);
    return products[idx];
  },
  delete: (id) => {
    let products = readProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    writeProducts(products);
    return products.length < initialLength;
  }
}; 
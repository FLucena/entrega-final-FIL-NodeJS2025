// --- Utilidades de validación ---
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

export function isValidProductFields({ name, description, price, stock }) {
  return name && description && price && stock;
}

export function isValidPatchFields(updateData) {
  if (!updateData || Object.keys(updateData).length === 0) return false;
  const allowedFields = ['name', 'description', 'price', 'stock'];
  return Object.keys(updateData).every(field => allowedFields.includes(field));
}

export function toNumberIfPresent(obj, fields) {
  const result = { ...obj };
  fields.forEach(field => {
    if (result[field] !== undefined) {
      result[field] = Number(result[field]);
    }
  });
  return result;
} 
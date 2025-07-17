// --- Modelo de Usuario basado en archivo JSON local ---
// Proporciona funciones CRUD para usuarios usando mockUsers.json

import fs from 'fs';
import path from 'path';

const dataPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/mockUsers.json');

// Lee todos los usuarios del archivo
function readUsers() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

// Escribe la lista de usuarios en el archivo
function writeUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

// Devuelve todos los usuarios
export function getAll() {
  return readUsers();
}

// Devuelve un usuario por ID
export function getById(id) {
  return readUsers().find(u => u.id === id);
}

// Crea un nuevo usuario y lo guarda
export function create(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

// Actualiza un usuario existente por ID
export function update(id, updatedUser) {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updatedUser };
  writeUsers(users);
  return users[idx];
}

// Elimina un usuario por ID
export function remove(id) {
  let users = readUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  writeUsers(users);
  return users.length < initialLength;
} 
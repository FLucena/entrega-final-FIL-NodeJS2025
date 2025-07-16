import fs from 'fs';
import path from 'path';

const dataPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/mockUsers.json');

function readUsers() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

export function getAll() {
  return readUsers();
}

export function getById(id) {
  return readUsers().find(u => u.id === id);
}

export function create(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

export function update(id, updatedUser) {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updatedUser };
  writeUsers(users);
  return users[idx];
}

export function remove(id) {
  let users = readUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  writeUsers(users);
  return users.length < initialLength;
} 
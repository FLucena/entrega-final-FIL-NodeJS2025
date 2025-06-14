const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/users.json');

function readUsers() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

module.exports = {
  getAll: () => readUsers(),
  getByEmail: (email) => readUsers().find(u => u.email === email),
  create: (user) => {
    const users = readUsers();
    users.push(user);
    writeUsers(users);
    return user;
  }
}; 
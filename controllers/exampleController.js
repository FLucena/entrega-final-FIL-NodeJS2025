import { db } from '../config/firebase.js';

export const getExamples = async (req, res) => {
  try {
    const snapshot = await db.collection('examples').get();
    const examples = [];
    snapshot.forEach(doc => {
      examples.push({ id: doc.id, ...doc.data() });
    });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createExample = async (req, res) => {
  try {
    const { name, description } = req.body;
    const docRef = await db.collection('examples').add({
      name,
      description,
      createdAt: new Date()
    });
    res.status(201).json({ id: docRef.id, name, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PLACES_FILE = path.join(__dirname, 'src', 'data', 'places.json');

// API route to get places data
app.get('/api/places', (req, res) => {
  try {
    if (fs.existsSync(PLACES_FILE)) {
      const data = fs.readFileSync(PLACES_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'Places file not found' });
    }
  } catch (error) {
    console.error('Error reading places.json:', error);
    res.status(500).json({ error: 'Failed to load places data' });
  }
});

// API route to save places data
app.post('/api/places', (req, res) => {
  try {
    const places = req.body;
    fs.writeFileSync(PLACES_FILE, JSON.stringify(places, null, 2), 'utf-8');
    console.log('Successfully saved places to project folder');
    res.json({ message: 'Places saved successfully' });
  } catch (error) {
    console.error('Error writing places.json:', error);
    res.status(500).json({ error: 'Failed to save places data' });
  }
});

app.listen(PORT, () => {
  console.log(`Data server running on http://localhost:${PORT}`);
});

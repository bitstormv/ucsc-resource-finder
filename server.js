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
// Increased limit for base64 images
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const PLACES_FILE = path.join(__dirname, 'src', 'data', 'places.json');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', file: PLACES_FILE, exists: fs.existsSync(PLACES_FILE) });
});

// API route to get places data
app.get('/api/places', (req, res) => {
  console.log('GET /api/places - Reading data...');
  try {
    if (fs.existsSync(PLACES_FILE)) {
      const data = fs.readFileSync(PLACES_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      console.error('File not found:', PLACES_FILE);
      res.status(404).json({ error: 'Places file not found' });
    }
  } catch (error) {
    console.error('Error reading places.json:', error);
    res.status(500).json({ error: 'Failed to load places data' });
  }
});

// API route to save places data
app.post('/api/places', (req, res) => {
  console.log('POST /api/places - Received data. Length:', req.body?.length);
  try {
    const places = req.body;
    if (!Array.isArray(places)) {
      throw new Error('Data is not an array');
    }
    fs.writeFileSync(PLACES_FILE, JSON.stringify(places, null, 2), 'utf-8');
    console.log('Successfully saved', places.length, 'places to:', PLACES_FILE);
    res.json({ message: 'Places saved successfully', count: places.length });
  } catch (error) {
    console.error('Error writing places.json:', error);
    res.status(500).json({ error: 'Failed to save places data: ' + error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Data server running on http://localhost:${PORT}`);
  console.log(`Target file: ${PLACES_FILE}`);
});

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'health-tracker-secret-key';

app.use(cors());
app.use(express.json());

let db;

// Initialize Database
async function initDb() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      display_name TEXT,
      notifications_enabled BOOLEAN DEFAULT 1,
      dark_mode BOOLEAN DEFAULT 0,
      weekly_goal INTEGER DEFAULT 14,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      food_name TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      meal_time TEXT NOT NULL,
      notes TEXT,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      target INTEGER NOT NULL,
      current INTEGER DEFAULT 0,
      unit TEXT NOT NULL,
      goal_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

// Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Math.random().toString(36).substring(2, 15);
    
    await db.run(
      'INSERT INTO users (id, email, password, display_name) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, name]
    );

    const token = jwt.sign({ id: userId, email }, JWT_SECRET);
    res.json({ token, user: { id: userId, email, display_name: name } });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        display_name: user.display_name,
        notifications_enabled: !!user.notifications_enabled,
        weekly_goal: user.weekly_goal
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT id, email, display_name, notifications_enabled, weekly_goal FROM users WHERE id = ?', [req.user.id]);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile Routes
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { display_name, notifications_enabled, weekly_goal } = req.body;
  try {
    await db.run(
      'UPDATE users SET display_name = ?, notifications_enabled = ?, weekly_goal = ? WHERE id = ?',
      [display_name, notifications_enabled ? 1 : 0, weekly_goal, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Food Entries Routes
app.get('/api/entries', authenticateToken, async (req, res) => {
  try {
    const entries = await db.all('SELECT * FROM food_entries WHERE user_id = ? ORDER BY logged_at DESC', [req.user.id]);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/entries', authenticateToken, async (req, res) => {
  const { food_name, meal_type, meal_time, notes, logged_at } = req.body;
  const id = Math.random().toString(36).substring(2, 15);
  try {
    await db.run(
      'INSERT INTO food_entries (id, user_id, food_name, meal_type, meal_time, notes, logged_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, req.user.id, food_name, meal_type, meal_time, notes, logged_at]
    );
    res.json({ id, food_name, meal_type, meal_time, notes, logged_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    await db.run('DELETE FROM food_entries WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Goals Routes
app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const goals = await db.all('SELECT * FROM goals WHERE user_id = ?', [req.user.id]);
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goals', authenticateToken, async (req, res) => {
  const { title, target, current, unit, goal_type } = req.body;
  const id = Math.random().toString(36).substring(2, 15);
  try {
    await db.run(
      'INSERT INTO goals (id, user_id, title, target, current, unit, goal_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, req.user.id, title, target, current || 0, unit, goal_type]
    );
    res.json({ id, title, target, current: current || 0, unit, goal_type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    await db.run('DELETE FROM goals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const helmet   = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes  = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

// ── Base de dados ─────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => { console.error('Erro MongoDB:', err.message); process.exit(1); });

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);   // register, login
app.use('/api/users',  authRoutes);   // profile (GET e PUT)
app.use('/api/admin',  adminRoutes);  // gestão de utilizadores (admin)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ success: true, status: 'API a funcionar' }));

// ── Tratamento de erros ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API a correr em http://localhost:${PORT}`));

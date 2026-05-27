const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit  = require('express-rate-limit');
const User       = require('../models/User');
const { protect } = require('../middleware/auth');

// Rate limiting — máximo 10 tentativas por IP a cada 15 minutos (anti brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Demasiadas tentativas. Tente novamente em 15 minutos.' },
});

// Gera um token JWT com duração de 7 dias
const gerarToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Remove campos sensíveis da resposta
const sanitizar = (user) => ({
  nome: user.nome, email: user.email,
  telemovel: user.telemovel, role: user.role, bio: user.bio,
});

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register',
  authLimiter,
  [
    body('nome').trim().notEmpty().withMessage('O nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(422).json({ success: false, message: erros.array()[0].msg });
    }

    const { nome, email, telemovel, password } = req.body;

    try {
      if (await User.findOne({ email })) {
        return res.status(409).json({ success: false, message: 'Este email já está registado.' });
      }

      const utilizador = await User.create({ nome, email, telemovel, password });

      res.status(201).json({
        success: true,
        message: 'Utilizador registado com sucesso',
        token:   gerarToken(utilizador._id),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('A palavra-passe é obrigatória'),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(422).json({ success: false, message: erros.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const utilizador = await User.findOne({ email }).select('+password');

      if (!utilizador || !(await utilizador.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Email ou palavra-passe incorretos.' });
      }

      res.status(200).json({
        success: true,
        token:   gerarToken(utilizador._id),
        user:    sanitizar(utilizador),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── GET /api/users/profile ────────────────────────────────────────────────────
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ success: true, user: sanitizar(req.user) });
});

// ── PUT /api/users/profile ────────────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  const { nome, telemovel, bio } = req.body;

  try {
    const utilizador = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(nome      && { nome }),
        ...(telemovel !== undefined && { telemovel }),
        ...(bio       !== undefined && { bio }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Perfil atualizado', user: sanitizar(utilizador) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

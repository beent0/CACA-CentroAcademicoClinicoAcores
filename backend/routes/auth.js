const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

// Rate limiting — máximo de 10 tentativas por IP a cada 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Demasiadas tentativas. Tente novamente em 15 minutos.' },
});

// Rutas de Autenticação / Registo
router.post('/register', authLimiter, validateRegister, handleValidationErrors, authController.register);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, authController.login);

// Rutas de Perfil
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;

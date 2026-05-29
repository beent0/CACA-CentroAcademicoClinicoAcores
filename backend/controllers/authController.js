const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Gera um token JWT
const gerarToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Remove os campos sensíveis da resposta
const sanitizar = (user) => ({
  nome: user.nome, 
  email: user.email,
  telemovel: user.telemovel, 
  role: user.role, 
  bio: user.bio,
});

exports.register = async (req, res) => {
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
      token: gerarToken(utilizador._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
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
      token: gerarToken(utilizador._id),
      user: sanitizar(utilizador),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProfile = (req, res) => {
  res.status(200).json({ success: true, user: sanitizar(req.user) });
};

exports.updateProfile = async (req, res) => {
  const { nome, telemovel, bio } = req.body;

  try {
    const utilizador = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(nome && { nome }),
        ...(telemovel !== undefined && { telemovel }),
        ...(bio !== undefined && { bio }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Perfil atualizado', user: sanitizar(utilizador) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
